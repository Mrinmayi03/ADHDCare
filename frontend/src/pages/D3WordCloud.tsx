// src/components/D3WordCloud.tsx
import React, { useEffect, useRef } from "react";
import cloud from "d3-cloud";
import type { Word as D3CloudWord } from "d3-cloud";
import { select } from "d3-selection";
import { scaleOrdinal, scaleSqrt } from "d3-scale";
import { extent } from "d3-array";
import { schemeSet2 } from "d3-scale-chromatic";

// 1) Your raw data shape:
interface RawWord {
  text: string;
  value: number;
}
// 2) Extend with the layout properties d3-cloud will add:
type LayoutWord = RawWord & D3CloudWord;

export default function D3WordCloud({
  words,
  width,
  height,
}: {
  words: RawWord[];
  width: number;
  height: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    // Clear any previous rendering
    svgRef.current.innerHTML = "";

    // Color scale
    const color = scaleOrdinal<string>(schemeSet2);

    // Font-size scale [14–60]
    const [min, max] = extent(words, (d) => d.value) as [number, number];
    const fontSize = scaleSqrt().domain([min, max]).range([14, 60]);

    // Run the cloud layout
    cloud<LayoutWord>()
      .size([width, height])
      .words(words as LayoutWord[])   // safe because RawWord ⊆ LayoutWord
      .padding(3)
      .rotate(0)
      .font("sans-serif")
      .fontSize((d) => fontSize(d.value))
      .on("end", (placedWords: LayoutWord[]) => {
        // **Everything below must be inside this callback** **–** now placedWords is in scope
        const svg = select(svgRef.current!)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .append("g")
          .attr("transform", `translate(${width / 2},${height / 2})`);

        svg
          .selectAll("text")
          .data(placedWords)
          .enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
          .style("font-size", (d) => `${d.size}px`)
          .style("fill", (_, i) => color(String(i)))
          .text((d) => d.text);
      })
      .start();
  }, [words, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}
