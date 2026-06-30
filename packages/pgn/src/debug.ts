/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { parse } from '@mliebelt/pgn-parser';

console.log("=== ANNOTATIONS ===");
const pgn1 = `1. e4 {[%clk 1:00:00]} e5 {[%clk 0:59:58] [%eval -0.5]}`;
console.dir(parse(pgn1, { startRule: 'games' })[0].moves, { depth: null });

console.log("=== OFFICIAL TAGS ===");
const pgn2 = `[Event "FIDE World Cup 2017"]
[Site "Tbilisi GEO"]
[Date "2017.09.09"]
[Round "4.1"]
[White "Carlsen,M"]
[Black "Bu Xiangzhi"]
[Result "0-1"]
[WhiteElo "2827"]
[BlackElo "2710"]
[EventDate "2017.09.03"]
[ECO "C55"]

1. e4 0-1`;
console.dir(parse(pgn2, { startRule: 'games' })[0].tags, { depth: null });
