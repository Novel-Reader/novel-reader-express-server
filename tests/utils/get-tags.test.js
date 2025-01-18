import { getTags } from "../../src/utils/get-tags";

describe("getTags", () => {
  it("should return tags with ,", () => {
    let text = " ";
    let tags = getTags(text);
    expect(tags).toBe(",");
  });
  it("should return tags with", () => {
    let text = `我俯身吻向了那娇艳动人的红唇。被吻住的时候，神里还是愣住了。等她反应过来，我才缓缓地离开了她的嘴唇。
    “你、你…你这是……”神里感觉到自己的心跳不断加快，身体有一种酥酥麻麻的感觉，就好像全身被电了一样，有些使不上力气。
    “你不是想要我的答复吗？”我温柔地抱住神里，在她的耳旁轻声说道，“这就是我的答复，我的态度。”
    神里的内心一暖，听到我的话后，她的嘴角微微扬起一个弧度。
    “时、时间也不早了，我该回去休息了。”神里不舍地离开了我的怀抱，她的脸上依旧挂着两道醉人的红晕。
    `;
    let tags = getTags(text);
    expect(tags).toBe(",离开,感觉,答复,俯身,娇艳动人,红唇,时候,还是,愣住,反应");
  });
});

