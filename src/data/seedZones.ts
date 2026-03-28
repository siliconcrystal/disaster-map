import { MapZone } from "../types/task";

export const seedZones: MapZone[] = [
  {
    id: "zone-guangfu-elementary",
    type: "evacuation",
    name: "光復國小避難收容所",
    coordinates: [
      [23.6685, 121.4225],
      [23.6700, 121.4220],
      [23.6705, 121.4245],
      [23.6695, 121.4255],
      [23.6680, 121.4240],
    ],
    description:
      "光復國小已開放為緊急避難收容所。設有醫療站、物資發放點及臨時供水設備。志工請至校門口報到處登記。",
    color: "#37a4b5",
  },
  {
    id: "zone-sugar-factory",
    type: "ngo",
    name: "光復糖廠 NGO 支援中心",
    coordinates: [
      [23.6560, 121.4185],
      [23.6580, 121.4180],
      [23.6590, 121.4210],
      [23.6575, 121.4220],
      [23.6555, 121.4200],
    ],
    description:
      "花蓮光復糖廠園區已設為 NGO 物資集散與志工調配中心。提供熱食、飲水及寵物醫療照顧服務。各團隊請至糖廠大門服務台報到。",
    color: "#3b82f6",
  },
  {
    id: "zone-dongfu-restricted",
    type: "restricted",
    name: "東富村土石流警戒區",
    coordinates: [
      [23.6750, 121.4350],
      [23.6780, 121.4340],
      [23.6790, 121.4380],
      [23.6760, 121.4390],
    ],
    description:
      "東富村因土石流風險，實施封鎖管制。依災害防救法嚴禁非救災人員進入，違者依法裁罰。搜救隊請由東富路管制哨進入。",
    color: "#ff3333",
  },
];
