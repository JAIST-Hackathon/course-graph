import React, { useEffect, useRef, useState } from "react";
import './style.css';

// グローバルな型定義
declare global {
    var vis: any;
    var Papa: any;
    var SyllabusArray: SyllabusData[];
    var RelationArray: RelationData[];
}

interface VisNode {
    id: number;
    label: string;
    title?: string;
    color?: string;
    font?: { size: number };
}

interface VisEdge {
    from: number;
    to: number;
    arrows?: string;
    color?: { color: string; opacity: number };
}

interface SyllabusData {
    URL: string;
    講義コード: string;
    講義名称: string;
    学則科目名称: string;
    校地: string;
    代表教員: string;
    科目群: string;
    科目コード: string;
    授業実践言語: string;
    開講時期: string;
}

interface RelationData {
    source: string;
    target: string;
    label: string;
}

interface ClassInfo {
    syllabusUrl: string;
    classCode: string;
    className: string;
    regulationSubjectName: string;
    campus: string;
    instructor: string;
    subjectGroup: string;
    subjectCode: string;
    language: string;
    term: string;
}

const SubjectGraphPage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [network, setNetwork] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);

    // CSVファイルを読み込む関数
    const loadCsv = async (filePath: string): Promise<any[]> => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();

            return new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results: { data: any[]; errors: any[] }) => {
                        console.log("CSV読み込み完了", results.data);
                        resolve(results.data);
                    },
                    error: (error: Error) => {
                        reject(new Error(`CSV解析エラー: ${error.message}`));
                    }
                });
            });
        } catch (error) {
            console.error("致命的エラー:", error);
            return [];
        }
    };

    // シラバスのCSVを読み込んで得られるArrayをvis.DataSetに変換
    const convSyllabusArray2Nodes = (ary: SyllabusData[]) => {
        const nodes = ary.map(node => ({
            id: node.講義名称,
            label: node.講義名称,
        }));
        return new vis.DataSet(nodes);
    };

    // エッジスタイル
    const edgeStyles = (edge: RelationData) => {
        if (edge.label === "related") {
            return {
                from: edge.source,
                to: edge.target,
                arrows: { to: { scaleFactor: 2 } },
                label: ""
            };
        } else if (edge.label === "recommended") {
            return {
                from: edge.source,
                to: edge.target,
                arrows: "from",
                label: "望ましい",
            };
        } else if (edge.label === "equivalent") {
            return {
                from: edge.source,
                to: edge.target,
                arrows: "from",
                label: "知識が必要",
                color: { color: "#FF0000" },
            };
        } else if (edge.label === "required") {
            return {
                from: edge.source,
                to: edge.target,
                arrows: "to",
                label: "受講必須",
                color: { color: "#FF0000" },
                value: 2,
                endPointOffset: { from: 5 },
            };
        } else if (edge.label === "exclusive") {
            return {
                from: edge.source,
                to: edge.target,
                arrows: "from",
                color: { color: "#FF00FF" },
                label: "履修不可",
                value: 2,
            };
        } else {
            return {
                from: edge.source,
                to: edge.target,
                arrows: "to",
                label: edge.label
            };
        }
    };

    const convRelationArray2Edges = (ary: RelationData[]) => {
        const edges = ary.map(edge => edgeStyles(edge));
        return new vis.DataSet(edges);
    };

    // 連結部分のみのノードを取得
    const getConnectedNodes = () => {
        if (!window.RelationArray) return [];
        const nodes = Array.from(new Set(
            window.RelationArray.flatMap((edge: RelationData) => [edge.source, edge.target])
        ));
        return nodes.map(node => ({ id: node, label: node }));
    };

    // 全体グラフを表示
    const showAllGraph = () => {
        if (!containerRef.current || !network) return;
        const nodes = convSyllabusArray2Nodes(window.SyllabusArray);
        const edges = convRelationArray2Edges(window.RelationArray);
        network.setData({ nodes, edges });
    };

    // 連結部分のみ表示
    const showConnectedGraph = () => {
        if (!containerRef.current || !network) return;
        const nodes = new vis.DataSet(getConnectedNodes());
        const edges = convRelationArray2Edges(window.RelationArray);
        network.setData({ nodes, edges });
    };

    // 指定した講義に関連のあるノードのみ表示
    const showRelatedGraph = (className: string) => {
        if (!containerRef.current || !network) return;
        if (!window.RelationArray) return;
        // 関連するノードを抽出
        const relatedClassSet = new Set<string>();
        relatedClassSet.add(className);
        window.RelationArray.forEach((edge: RelationData) => {
            if (edge.source === className || edge.target === className) {
                relatedClassSet.add(edge.source);
                relatedClassSet.add(edge.target);
            }
        });
        const nodes = new vis.DataSet(Array.from(relatedClassSet).map(name => ({ id: name, label: name })));
        const edges = convRelationArray2Edges(window.RelationArray.filter((edge: RelationData) => relatedClassSet.has(edge.source) && relatedClassSet.has(edge.target)));
        network.setData({ nodes, edges });
    };

    // グラフを表示する関数
    const displayGraph = async () => {
        try {
            setIsLoading(true);
            console.log('Starting to load CSV files...');

            // CSVファイルの読み込み
            const syllabusCsvFilePath = '/jaist_syllabus_cs_ishikawa_2025.csv';
            const relationCsvFilePath = '/class_relation.csv';
            console.log('Loading syllabus CSV from:', syllabusCsvFilePath);
            console.log('Loading relation CSV from:', relationCsvFilePath);

            const syllabusData = await loadCsv(syllabusCsvFilePath);
            const relationData = await loadCsv(relationCsvFilePath);

            // グローバル変数に保存
            window.SyllabusArray = syllabusData;
            window.RelationArray = relationData;

            // ノードとエッジの作成
            const nodes = convSyllabusArray2Nodes(syllabusData);
            const edges = convRelationArray2Edges(relationData);

            // グラフの表示
            if (!containerRef.current) return;

            const data = {
                nodes: nodes,
                edges: edges
            };

            const options = {
                interaction: {
                    navigationButtons: false,
                    keyboard: true,
                    scaling: {
                        customScalingFunction: function (min: number, max: number, total: number, value: number) {
                            return value / total;
                        },
                        min: 5,
                        max: 150,
                    },
                },
            };

            const newNetwork = new vis.Network(containerRef.current, data, options);
            setNetwork(newNetwork);

            // ノードクリック時のイベントハンドラ
            newNetwork.on('click', (params: any) => {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    const record = SyllabusArray.find((row: SyllabusData) => row.講義名称 === nodeId);
                    if (record) {
                        setClassInfo({
                            syllabusUrl: record.URL,
                            classCode: record.講義コード,
                            className: record.講義名称,
                            regulationSubjectName: record.学則科目名称,
                            campus: record.校地,
                            instructor: record.代表教員,
                            subjectGroup: record.科目群,
                            subjectCode: record.科目コード,
                            language: record.授業実践言語,
                            term: record.開講時期
                        });
                    }
                }
            });

            // 講義選択用プルダウンの設定
            const selectElement = document.getElementById('classSlect') as HTMLSelectElement;
            if (selectElement) {
                syllabusData.forEach((record: SyllabusData) => {
                    const option = document.createElement('option');
                    option.text = `${record.科目コード} ${record.講義名称}`;
                    option.value = record.講義名称;
                    selectElement.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error displaying graph:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        displayGraph();
    }, []);

    return (
        <div className="container mx-auto p-4">
            {isLoading && <div id="loadingMessage">Loading...</div>}
            <div className="mb-4 flex gap-2">
                <button
                    onClick={showAllGraph}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    全体を表示
                </button>
                <button
                    onClick={showConnectedGraph}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    連結部分のみ表示
                </button>
            </div>
            <div className="mb-4">
                <select
                    id="classSlect"
                    className="w-full p-2 border rounded"
                    onChange={(e) => {
                        if (!containerRef.current || !network) return;
                        const selectedClass = e.target.value;
                        if (selectedClass) {
                            showRelatedGraph(selectedClass);
                        }
                        const record = SyllabusArray.find((row: SyllabusData) => row.講義名称 === selectedClass);
                        if (record) {
                            setClassInfo({
                                syllabusUrl: record.URL,
                                classCode: record.講義コード,
                                className: record.講義名称,
                                regulationSubjectName: record.学則科目名称,
                                campus: record.校地,
                                instructor: record.代表教員,
                                subjectGroup: record.科目群,
                                subjectCode: record.科目コード,
                                language: record.授業実践言語,
                                term: record.開講時期
                            });
                        }
                    }}
                >
                    <option value="">講義を選択</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div id="network" ref={containerRef} className="border rounded h-[300px]" style={{ width: '500px' }}></div>
                <div className="border rounded p-4">
                    <h2 className="text-xl font-bold mb-4">講義情報</h2>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="font-bold">シラバスURL</td>
                                <td id="syllabusUrl" style={{ wordBreak: 'break-all', maxWidth: '200px' }}>{classInfo?.syllabusUrl}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">講義コード</td>
                                <td id="classCode">{classInfo?.classCode}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">講義名称</td>
                                <td id="className">{classInfo?.className}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">学則科目名称</td>
                                <td id="regulationSubjectName">{classInfo?.regulationSubjectName}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">校地</td>
                                <td id="campus">{classInfo?.campus}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">代表教員</td>
                                <td id="instructor">{classInfo?.instructor}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">科目群</td>
                                <td id="subjectGroup">{classInfo?.subjectGroup}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">科目コード</td>
                                <td id="subjectCode">{classInfo?.subjectCode}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">授業実践言語</td>
                                <td id="language">{classInfo?.language}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">開講時期</td>
                                <td id="term">{classInfo?.term}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubjectGraphPage;