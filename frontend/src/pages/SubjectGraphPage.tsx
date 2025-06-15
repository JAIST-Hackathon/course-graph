import React, { useEffect, useRef, useCallback } from "react";

const App: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const initializeNetwork = useCallback(() => {
        // window.vis からライブラリにアクセス
        const { vis } = window;

        const nodes = new vis.DataSet([
            { id: 1, label: "A" },
            { id: 2, label: "B" },
            { id: 3, label: "C" },
            { id: 4, label: "D" },
            { id: 5, label: "E" },
            { id: 6, label: "F" },
            { id: 7, label: "G" },
            { id: 8, label: "H" },
        ]);

        const edges = new vis.DataSet([
            { from: 1, to: 2, arrows: "to" },
            { from: 1, to: 3, arrows: "to" },
            { from: 3, to: 4, arrows: "to" },
            { from: 6, to: 1, arrows: "to" },
            { from: 7, to: 8, arrows: "to" },
            { from: 8, to: 7, arrows: "to" },
        ]);

        const data = { nodes, edges };
        const options = {
            nodes,
            edges,
        };

        new vis.Network(containerRef.current, data, options);
    }, []);

    useEffect(() => {
        initializeNetwork();
    }, [initializeNetwork]);

    return <div ref={containerRef} style={{
        height: "calc(90vh - 50px)", // ビューポートの高さ100%
        width: "100%"    // 幅も明示的に100%
    }} className="border" />;
};

export default App;