import { useMemo } from 'react';
import { ResponsiveContainer, Treemap, Cell, PieChart, Pie, Tooltip, Legend } from 'recharts';
import { clusteringUtils } from '@/hooks/use-clustering';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Maximize2, 
  Download, 
  Settings, 
  BarChart3, 
  Target, 
  Network, 
  List,
  Info,
  Zap,
  TrendingUp
} from 'lucide-react';

interface ClusteringVisualizationProps {
  analysis: any;
  visualizationType: 'sunburst' | 'treemap' | 'network' | 'list';
}

export function ClusteringVisualization({ analysis, visualizationType }: ClusteringVisualizationProps) {
  const transformedData = useMemo(() => {
    if (!analysis?.clusters) return null;
    return clusteringUtils.transformForVisualization(analysis.clusters, visualizationType);
  }, [analysis, visualizationType]);

  const colors = useMemo(() => {
    if (!analysis?.clusters) return [];
    return clusteringUtils.generateClusterColors(analysis.clusters.length);
  }, [analysis]);

  if (!analysis || !transformedData) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-brevia-muted">No data to visualize</p>
      </div>
    );
  }

  const renderTreemap = () => (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={transformedData.children}
        dataKey="value"
        aspectRatio={4 / 3}
        stroke="#374151"
        strokeWidth={2}
        content={({ root, depth, x, y, width, height, index, name, value }) => {
          if (depth === 1) {
            return (
              <g>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  style={{
                    fill: colors[index % colors.length],
                    fillOpacity: 0.8,
                    stroke: '#374151',
                    strokeWidth: 2,
                  }}
                />
                {width > 60 && height > 30 && (
                  <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {name}
                  </text>
                )}
                {width > 60 && height > 50 && (
                  <text
                    x={x + width / 2}
                    y={y + height / 2 + 16}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                  >
                    {value} docs
                  </text>
                )}
              </g>
            );
          }
          return null;
        }}
      />
    </ResponsiveContainer>
  );

  // Professional Sunburst like Delv AI
  const renderSunburst = () => {
    const totalDocs = analysis.clusters.reduce((sum: number, cluster: any) => sum + cluster.documents.length, 0);
    
    return (
      <div className="delv-viz-container h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Target className="h-5 w-5 text-emerald-400" />
            <h3 className="delv-subtitle">Research Clusters</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              {/* Inner ring - Main categories */}
              <Pie
                data={analysis.clusters.map((cluster: any, index: number) => ({
                  name: cluster.label,
                  value: cluster.documents.length,
                  fill: cluster.color || colors[index % colors.length],
                  percentage: ((cluster.documents.length / totalDocs) * 100).toFixed(1)
                }))}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={3}
                dataKey="value"
                stroke="#27272a"
                strokeWidth={2}
              >
                {analysis.clusters.map((cluster: any, index: number) => (
                  <Cell 
                    key={`inner-${index}`} 
                    fill={cluster.color || colors[index % colors.length]}
                  />
                ))}
              </Pie>
              
              {/* Outer ring - Documents */}
              <Pie
                data={analysis.clusters.flatMap((cluster: any, clusterIndex: number) =>
                  cluster.documents.map((doc: any, docIndex: number) => ({
                    name: doc.title,
                    value: doc.relevance * 100,
                    fill: cluster.color || colors[clusterIndex % colors.length],
                    cluster: cluster.label,
                    opacity: 0.7 + (doc.relevance * 0.3)
                  }))
                )}
                cx="50%"
                cy="50%"
                innerRadius={150}
                outerRadius={200}
                paddingAngle={1}
                dataKey="value"
                stroke="#27272a"
                strokeWidth={1}
              >
                {analysis.clusters.flatMap((cluster: any, clusterIndex: number) =>
                  cluster.documents.map((doc: any, docIndex: number) => (
                    <Cell 
                      key={`outer-${clusterIndex}-${docIndex}`}
                      fill={cluster.color || colors[clusterIndex % colors.length]}
                      fillOpacity={0.7 + (doc.relevance * 0.3)}
                    />
                  ))
                )}
              </Pie>

              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-zinc-800/95 border border-zinc-700/50 rounded-lg p-4 shadow-xl backdrop-blur-sm max-w-xs">
                        <div className="font-semibold text-zinc-100 mb-1">{data.name}</div>
                        {data.cluster && (
                          <div className="text-xs text-zinc-400 mb-2">{data.cluster}</div>
                        )}
                        <div className="text-sm text-zinc-300">
                          {data.value.toFixed(1)}{data.cluster ? '% relevance' : ' documents'}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="delv-metric text-4xl mb-1">{totalDocs}</div>
              <div className="delv-caption">Papers</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {analysis.clusters.map((cluster: any, index: number) => (
            <div key={cluster.id} className="flex items-center space-x-3 delv-card p-3">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: cluster.color || colors[index % colors.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-zinc-200 truncate">{cluster.label}</div>
                <div className="delv-caption">
                  {cluster.documents.length} papers • {((cluster.documents.length / totalDocs) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNetwork = () => (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-brevia-secondary rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-brevia-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">Network Visualization</h3>
        <p className="text-brevia-muted max-w-md">
          Interactive network graph coming soon. This will show relationships between clusters and documents.
        </p>
      </div>
    </div>
  );

  const renderList = () => (
    <ScrollArea className="flex-1 p-6">
      <div className="space-y-4">
        {analysis.clusters.map((cluster: any, index: number) => (
          <Card key={cluster.id || index} className="brevia-workbench-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{cluster.label}</CardTitle>
                <Badge variant="secondary" style={{ backgroundColor: colors[index % colors.length] }}>
                  {cluster.documents.length} docs
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cluster.documents.slice(0, 3).map((doc: any, docIndex: number) => (
                  <div key={doc.id || docIndex} className="border-l-2 border-brevia-primary pl-3">
                    <h4 className="font-medium text-sm">{doc.title}</h4>
                    <p className="text-xs text-brevia-muted line-clamp-2">{doc.snippet}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {Math.round(doc.relevance * 100)}% relevant
                      </Badge>
                    </div>
                  </div>
                ))}
                {cluster.documents.length > 3 && (
                  <p className="text-xs text-brevia-muted">
                    +{cluster.documents.length - 3} more documents
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 p-6">
      {visualizationType === 'sunburst' && renderSunburst()}
      
      {visualizationType === 'treemap' && (
        <div className="delv-viz-container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
              <h3 className="delv-subtitle">Treemap View</h3>
            </div>
          </div>
          <div className="h-96">
            {renderTreemap()}
          </div>
        </div>
      )}
      
      {visualizationType === 'network' && (
        <div className="delv-viz-container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Network className="h-5 w-5 text-emerald-400" />
              <h3 className="delv-subtitle">Network Analysis</h3>
            </div>
          </div>
          {renderNetwork()}
        </div>
      )}
      
      {visualizationType === 'list' && (
        <div className="delv-viz-container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <List className="h-5 w-5 text-emerald-400" />
              <h3 className="delv-subtitle">Detailed List</h3>
            </div>
          </div>
          {renderList()}
        </div>
      )}
    </div>
  );
}

export default ClusteringVisualization;