import { getUserData } from "@decentraland/Identity"
import { signedFetch } from "@decentraland/SignedFetch";

@Component('FloorComponent')
class FloorComponent {
  constructor() {
  }
}

const stand = new Entity();
stand.addComponent(new BoxShape());
stand.addComponent(new Transform({ position: new Vector3(8, -0.5, 8), scale: new Vector3().setAll(2) }));
stand.addComponent(new FloorComponent())
stand.getComponentOrCreate(Material).albedoColor = new Color4(1, 1, 1, 1)
engine.addEntity(stand);

const avatar = new Entity();
const avatarShape = new AvatarShape();

avatarShape.bodyShape = "urn:decentraland:off-chain:base-avatars:BaseFemale";
avatarShape.wearables = [
  "urn:decentraland:off-chain:base-avatars:f_sweater",
  "urn:decentraland:off-chain:base-avatars:f_jeans",
  "urn:decentraland:off-chain:base-avatars:bun_shoes",
  "urn:decentraland:off-chain:base-avatars:standard_hair",
  "urn:decentraland:off-chain:base-avatars:f_eyes_00",
  "urn:decentraland:off-chain:base-avatars:f_eyebrows_00",
  "urn:decentraland:off-chain:base-avatars:f_mouth_00",
];
avatarShape.skinColor = new Color4(0.94921875, 0.76171875, 0.6484375, 1);
avatarShape.eyeColor = new Color4(0.23046875, 0.625, 0.3125, 1);
avatarShape.hairColor = new Color4(0.234375, 0.12890625, 0.04296875, 1);
avatar.addComponent(avatarShape);
avatar.addComponent(new Transform({ position: new Vector3(8, 0.15, 8), scale: new Vector3().setAll(1.5) }));
engine.addEntity(avatar);


const HPavatar = new Entity();
const HPavatarShape = new AvatarShape();

HPavatarShape.name = "Made by HPrivakos";
HPavatarShape.bodyShape = "urn:decentraland:off-chain:base-avatars:BaseMale";
HPavatarShape.wearables = [
  "urn:decentraland:off-chain:base-avatars:eyebrows_00",
  "urn:decentraland:off-chain:base-avatars:mouth_00",
  "urn:decentraland:off-chain:base-avatars:eyes_00",
  "urn:decentraland:ethereum:collections-v1:xmas_2019:santa_facial_hair",
  "urn:decentraland:ethereum:collections-v1:dcl_launch:razor_blade_upper_body",
  "urn:decentraland:off-chain:base-avatars:casual_hair_01",
  "urn:decentraland:ethereum:collections-v1:halloween_2019:classic_top_hat",
  "urn:decentraland:ethereum:collections-v1:community_contest:cw_monocle_eyewear",
  "urn:decentraland:ethereum:collections-v1:dcl_launch:dcl_mana_earring",
  "urn:decentraland:ethereum:collections-v1:dcl_launch:m_barbarian_lower_body",
  "urn:decentraland:ethereum:collections-v1:halloween_2020:hwn_2020_cult_supreme_feet"
]
HPavatarShape.skinColor = new Color4(0.94921875, 0.76171875, 0.6484375, 1);
HPavatarShape.eyeColor = new Color4(0.23046875, 0.625, 0.3125, 1);
HPavatarShape.hairColor = new Color4(0.234375, 0.12890625, 0.04296875, 1);
HPavatar.addComponent(HPavatarShape);
HPavatar.addComponent(new Transform({ position: new Vector3(2, 0, 2), scale: new Vector3().setAll(1) }));
engine.addEntity(HPavatar);


void getUserData().then(async a => {
  const res = await fetch(`https://peer.decentraland.org/lambdas/profiles/${a?.publicKey}`)
  const json = await res.json()
  const av = json.avatars[0].avatar
  avatarShape.bodyShape = av.bodyShape
  avatarShape.skinColor = new Color4(av.skin.color.r, av.skin.color.g, av.skin.color.b, 1);
  avatarShape.eyeColor = new Color4(av.eyes.color.r, av.eyes.color.g, av.eyes.color.b, 1);
  avatarShape.hairColor = new Color4(av.hair.color.r, av.hair.color.g, av.hair.color.b, 1);
  avatarShape.wearables = av.wearables
})

let worldUrl = "";

const deployBlock = new Entity()
deployBlock.addComponent(new BoxShape())
deployBlock.addComponent(new Transform({ position: new Vector3(8, 1, 12) }))
deployBlock.getComponentOrCreate(Material).albedoColor = new Color4(2, 0, 0, 1)
deployBlock.addComponent(new OnPointerDown(async (e) => {
  const color = deployBlock.getComponentOrCreate(Material).albedoColor?.toHexString()
  log(deployBlock.getComponentOrCreate(Material).albedoColor)
  if (color == new Color4(2, 0, 0, 1).toHexString()) {
    text.getComponent(TextShape).value = "Click again to confirm."
    return deployBlock.getComponentOrCreate(Material).albedoColor = new Color4(2, 2, 0, 1)
  }
  if (color == new Color4(2, 2, 0, 1).toHexString()) {
    text.getComponent(TextShape).value = "Deploying..."
    const signed = await signedFetch("https://worlds.dcl.guru/")
    if (signed.status == 200) {
      const json = JSON.parse(signed.text!)
      worldUrl = json.msg
      log(json)
      text.getComponent(TextShape).value = "Deployed\nClick to go to your World"
      return deployBlock.getComponentOrCreate(Material).albedoColor = new Color4(0, 2, 0, 1)
    }
    text.getComponent(TextShape).value = "Error deploying"
    return deployBlock.getComponentOrCreate(Material).albedoColor = new Color4(2, 0, 0, 0.9)
  }
  if (color == new Color4(0, 1, 0, 1).toHexString()) {
    openExternalURL(worldUrl)
  }

}))
engine.addEntity(deployBlock)

const text = new Entity()
text.addComponent(new TextShape("Click to deploy this to your World.\nThis will overwrite your current World."))
text.getComponent(TextShape).fontSize = 2
text.addComponent(new Billboard(false, true, false))
text.addComponent(new Transform({ position: new Vector3(8, 2, 12) }))
engine.addEntity(text)

function HSVtoRGB({ h, s, v }: { h: number, s: number, v: number }) {
  var r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return [
    (r || 0),
    (g || 0),
    (b || 0),
    1]
    ;
}

const rgb = HSVtoRGB({ h: 0.5, s: 1, v: 2 })
log(JSON.stringify(rgb))



const floor = new Entity()
floor.addComponent(new BoxShape())
floor.addComponent(new FloorComponent())
floor.addComponent(new Transform({ scale: new Vector3(16, 0.1, 16), position: new Vector3(8, -0.05, 8) }))
floor.getComponentOrCreate(Material).albedoColor = Color4.FromArray(rgb)

engine.addEntity(floor)

class FloorSystem implements ISystem {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(FloorComponent)
  lastUpdate = 0;
  update(dt: number) {
    const timeFloor = (new Date().getSeconds() * 1000 + new Date().getMilliseconds()) * 0.006 / 60
    const timeStand = (new Date().getMinutes() * 60000 + new Date().getSeconds() * 1000 + new Date().getMilliseconds()) * 0.006 / 60 / 60
    floor.getComponentOrCreate(Material).albedoColor = Color4.FromArray(HSVtoRGB({ h: timeFloor, s: 2, v: 3 }))
    if (stand.getComponentOrCreate(Material).albedoColor!.asArray()[3] > 0)
      stand.getComponentOrCreate(Material).albedoColor = Color4.FromArray(HSVtoRGB({ h: timeStand, s: 1, v: 3 }))

  }
}

// Add a new instance of the system to the engine
engine.addSystem(new FloorSystem())

class MegAvatarSystem implements ISystem {
  // this group will contain every entity that has a Transform component
  mega: boolean = false;
  camera = new Camera()
  lastUpdate = 0;
  update(dt: number) {
    this.lastUpdate += dt
    if (this.lastUpdate < 2) return
    this.lastUpdate = 0
    const pos = this.camera.position.asArray()
    if (pos[0] > 16 || pos[0] < 0 || pos[2] > 16 || pos[2] < 0) {
      if (this.mega === true) return
      this.mega = true
      stand.getComponent(BoxShape).visible = false
      avatar.getComponent(Transform).scale.setAll(5)
      avatar.getComponent(Transform).position.y = -3
    }
    else {
      if (this.mega === false) return
      this.mega = false
      stand.getComponent(BoxShape).visible = true
      avatar.getComponent(Transform).scale.setAll(1.5)
      avatar.getComponent(Transform).position.y = 0.15

    }
  }
}

// Add a new instance of the system to the engine
engine.addSystem(new MegAvatarSystem())
