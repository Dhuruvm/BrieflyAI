import { useMemo } from 'react';
import { ResponsiveContainer, Treemap, Cell, PieChart, Pie, Tooltip, Legend } from 'recharts';
import { clusteringUtils } from '@/hooks/use-clustering';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const renderSunburst = () => {
    const pieData = analysis.clusters.map((cluster: any, index: number) => ({
      name: cluster.label,
      value: cluster.documents.length,
      fill: colors[index % colors.length],
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={150}
            innerRadius={60}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0];
                return (
                  <div className="bg-brevia-secondary border border-brevia-default rounded-lg p-3 shadow-lg">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm text-brevia-muted">{data.value} documents</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
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
    <div className="flex-1 flex flex-col">
      {visualizationType === 'treemap' && (
        <div className="flex-1 p-6">
          {renderTreemap()}
        </div>
      )}
      
      {visualizationType === 'sunburst' && (
        <div className="flex-1 p-6">
          {renderSunburst()}
        </div>
      )}
      
      {visualizationType === 'network' && renderNetwork()}
      
      {visualizationType === 'list' && renderList()}
      
      {/* Statistics Footer */}
      <div className="border-t border-brevia-default p-4 bg-brevia-secondary">
        <div className="flex items-center justify-between text-sm">
          <span className="text-brevia-muted">
            {analysis.clusters.length} clusters • {analysis.metadata?.totalDocuments || 0} documents
          </span>
          <span className="text-brevia-muted">
            Processed in {analysis.metadata?.processingTime || 0}s
          </span>
        </div>
      </div>
    </div>
  );
}

export default ClusteringVisualization;