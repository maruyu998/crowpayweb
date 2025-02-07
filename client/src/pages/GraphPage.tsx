import React, { useState, useEffect, useRef } from "react";
import Topbar from "../components/Topbar";
import { useTop } from "../contexts/TopProvider";
import ForceGraph2D from "react-force-graph-2d";
import { UserGraphType } from "../../../mtypes/UserType";
import { FriendGraphType } from "../../../mtypes/FriendType";
import { getGraph } from "../data/user";

export default function GraphPage(){

  const { addAlert } = useTop();

  const [userGraphList, setUserGraphList] = useState<UserGraphType[]>([]);
  const [friendGraphList, setFriendGraphList] = useState<FriendGraphType[]>([]);
  
  useEffect(()=>{
    getGraph().then(({graphUsers, graphFriends})=>{
      setUserGraphList(graphUsers);
      setFriendGraphList(graphFriends);
    })
    .catch(error=>{
      addAlert(`FetchGraphError [${error.name}]`, error.message);
    });
  }, [])

  const elementRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const updateDimensions = () => {
    if(elementRef.current){
      setDimensions({ width: window.innerWidth, height: window.innerHeight - elementRef.current.offsetHeight });
    }
  };
  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => { window.removeEventListener('resize', updateDimensions); };
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      <div ref={elementRef}>
        <Topbar/>
      </div>
      <ForceGraph2D
        // [Data input]
        // graphData?: GraphData<NodeObject<NodeType>, LinkObject<NodeType, LinkType>>;
        graphData={{
          nodes: userGraphList.sort((a,b)=>Math.abs(b.amount)-Math.abs(a.amount)).map(userGraph=>({
            id: userGraph.userId, 
            labelLines: [`${userGraph.userDisplayName}`,`(¥${userGraph.amount})`,userGraph.walletNames.join(',')],
            amount: userGraph.amount,
            val: (10+Math.abs(userGraph.amount))/50000*8,
            color: `hsl(${100-userGraph.amount/100},100%,${50+userGraph.amount/600}%)`
          })),
          links: friendGraphList.map(({userId,friendUserId})=>({source:userId, target:friendUserId}))
        }}
        // nodeId?: string;
        // linkSource?: string;
        // linkTarget?: string;

        // [Container layout]
        width={dimensions.width}
        height={dimensions.height}
        // backgroundColor?: string;

        // [Node styling]
        // nodeRelSize?: number;
        // nodeVal?: NodeAccessor<NodeType, number>;
        // nodeLabel?: NodeAccessor<NodeType, string>;
        // nodeVisibility?: NodeAccessor<NodeType, boolean>;
        // nodeColor?: NodeAccessor<NodeType, string>;
        // nodeAutoColorBy?: NodeAccessor<NodeType, string | null>;
        // nodeCanvasObjectMode?: string | ((obj: NodeObject<NodeType>) => CanvasCustomRenderMode | any);
        nodeCanvasObjectMode={() => "after"}
        // nodeCanvasObject?: CanvasCustomRenderFn<NodeObject<NodeType>>;
        nodeCanvasObject={(node, ctx, globalScale) => {
          const fontsize = 14 / globalScale
          ctx.font = `${fontsize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = node.amount >= 0 ? "black" : "red";
          for(let i=0; i<node.labelLines.length; i++){
            const margin = fontsize * 1.2 * (i+0.5 - node.labelLines.length / 2)
            ctx.fillText(node.labelLines[i], node.x!, node.y! + margin);
          }
        }}
        // nodePointerAreaPaint?: CanvasPointerAreaPaintFn<NodeObject<NodeType>>;

        // [Link styling]
        // linkLabel?: LinkAccessor<NodeType, LinkType, string>;
        // linkVisibility?: LinkAccessor<NodeType, LinkType, boolean>;
        // linkColor?: LinkAccessor<NodeType, LinkType, string>;
        // linkAutoColorBy?: LinkAccessor<NodeType, LinkType, string | null>;
        // linkLineDash?: LinkAccessor<NodeType, LinkType, number[] | null>;
        // linkWidth?: LinkAccessor<NodeType, LinkType, number>;
        // linkCurvature?: LinkAccessor<NodeType, LinkType, number>;
        // linkCanvasObject?: CanvasCustomRenderFn<LinkObject<NodeType, LinkType>>;
        // linkCanvasObjectMode?: string | ((obj: LinkObject<NodeType, LinkType>) => CanvasCustomRenderMode | any);
        // linkDirectionalArrowLength?: LinkAccessor<NodeType, LinkType, number>;
        // linkDirectionalArrowColor?: LinkAccessor<NodeType, LinkType, string>;
        // linkDirectionalArrowRelPos?: LinkAccessor<NodeType, LinkType, number>;
        // linkDirectionalParticles?: LinkAccessor<NodeType, LinkType, number>;
        // linkDirectionalParticleSpeed?: LinkAccessor<NodeType, LinkType, number>;
        // linkDirectionalParticleWidth?: LinkAccessor<NodeType, LinkType, number>;
        // linkDirectionalParticleColor?: LinkAccessor<NodeType, LinkType, string>;
        // linkPointerAreaPaint?: CanvasPointerAreaPaintFn<LinkObject<NodeType, LinkType>>;

        // [Render control]
        // autoPauseRedraw?: boolean;
        // minZoom?: number;
        // maxZoom?: number;
        // onRenderFramePre?: (canvasContext: CanvasRenderingContext2D, globalScale: number) => void;
        // onRenderFramePost?: (canvasContext: CanvasRenderingContext2D, globalScale: number) => void;

        // [Force engine (d3-force) configuration]
        // dagMode?: DagMode;
        // dagLevelDistance?: number | null;
        // dagNodeFilter?: (node: NodeObject<NodeType>) => boolean;
        // onDagError?: ((loopNodeIds: (string | number)[]) => void) | undefined;
        // d3AlphaMin?: number;
        // d3AlphaDecay?: number;
        // d3VelocityDecay?: number;
        // ngraphPhysics?: object;
        // warmupTicks?: number;
        // cooldownTicks?: number;
        // cooldownTime?: number;
        // onEngineTick?: () => void;
        // onEngineStop?: () => void;

        // [Interaction]
        // onNodeClick?: (node: NodeObject<NodeType>, event: MouseEvent) => void;
        // onNodeRightClick?: (node: NodeObject<NodeType>, event: MouseEvent) => void;
        // onNodeHover?: (node: NodeObject<NodeType> | null, previousNode: NodeObject<NodeType> | null) => void;
        // onNodeDrag?: (node: NodeObject<NodeType>, translate: { x: number, y: number }) => void;
        // onNodeDragEnd?: (node: NodeObject<NodeType>, translate: { x: number, y: number }) => void;
        // onLinkClick?: (link: LinkObject<NodeType, LinkType>, event: MouseEvent) => void;
        // onLinkRightClick?: (link: LinkObject<NodeType, LinkType>, event: MouseEvent) => void;
        // onLinkHover?: (link: LinkObject<NodeType, LinkType> | null, previousLink: LinkObject<NodeType, LinkType> | null) => void;
        // linkHoverPrecision?: number;
        // onBackgroundClick?: (event: MouseEvent) => void;
        // onBackgroundRightClick?: (event: MouseEvent) => void;
        // onZoom?: (transform: {k: number, x: number, y: number}) => void;
        // onZoomEnd?: (transform: {k: number, x: number, y: number}) => void;
        // enableNodeDrag?: boolean;
        // enableZoomInteraction?: boolean;
        // enablePanInteraction?: boolean;
        // enablePointerInteraction?: boolean;
      />
    </div>
  );
}