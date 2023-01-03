import { getUserData } from "@decentraland/Identity";
import { signedFetch } from "@decentraland/SignedFetch";

@Component("FloorComponent")
class FloorComponent {
  constructor() { }
}

const stand = new Entity();
stand.addComponent(new BoxShape());
stand.addComponent(
  new Transform({
    position: new Vector3(8, -0.5, 8),
    scale: new Vector3().setAll(2),
  })
);
stand.addComponent(new FloorComponent());
stand.getComponentOrCreate(Material).albedoColor = new Color4(1, 1, 1, 1);
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
avatar.addComponent(
  new Transform({
    position: new Vector3(8, 0.15, 8),
    scale: new Vector3().setAll(1.5),
  })
);
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
  "urn:decentraland:ethereum:collections-v1:halloween_2020:hwn_2020_cult_supreme_feet",
];
HPavatarShape.skinColor = new Color4(0.94921875, 0.76171875, 0.6484375, 1);
HPavatarShape.eyeColor = new Color4(0.23046875, 0.625, 0.3125, 1);
HPavatarShape.hairColor = new Color4(0.234375, 0.12890625, 0.04296875, 1);
HPavatar.addComponent(HPavatarShape);
HPavatar.addComponent(
  new Transform({
    position: new Vector3(2, 0, 2),
    scale: new Vector3().setAll(1),
  })
);
engine.addEntity(HPavatar);

void getUserData().then(async (a) => {
  const res = await fetch(
    `https://peer.decentraland.org/lambdas/profiles/${a?.publicKey}`
  );
  const json = await res.json();
  const av = json.avatars[0].avatar;
  avatarShape.bodyShape = av.bodyShape;
  avatarShape.skinColor = new Color4(
    av.skin.color.r,
    av.skin.color.g,
    av.skin.color.b,
    1
  );
  avatarShape.eyeColor = new Color4(
    av.eyes.color.r,
    av.eyes.color.g,
    av.eyes.color.b,
    1
  );
  avatarShape.hairColor = new Color4(
    av.hair.color.r,
    av.hair.color.g,
    av.hair.color.b,
    1
  );
  avatarShape.wearables = av.wearables;
});

const floor = new Entity();
floor.addComponent(new BoxShape());
floor.addComponent(new FloorComponent());
floor.addComponent(
  new Transform({
    scale: new Vector3(16, 0.1, 16),
    position: new Vector3(8, -0.05, 8),
  })
);
floor.getComponentOrCreate(Material).albedoColor = Color3.FromArray([1, 1, 1]);

engine.addEntity(floor);
function color(frequency: number, time: number, saturation = 3): Color3 {
  const red = (Math.sin(frequency * time + 0) * 127 + 128) / 255;
  const green = (Math.sin(frequency * time + 2) * 127 + 128) / 255;
  const blue = (Math.sin(frequency * time + 4) * 127 + 128) / 255;
  return Color3.FromArray([
    red * saturation,
    green * saturation,
    blue * saturation,
  ]);
}
class FloorSystem implements ISystem {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(FloorComponent);
  lastUpdate = new Date().getSeconds() + new Date().getMilliseconds() / 1000
  frequency = 1
  update(dt: number) {
    this.lastUpdate+=dt
    floor.getComponentOrCreate(Material).albedoColor = Color4.FromColor3(color(this.frequency, this.lastUpdate, 3));
    if (stand.getComponentOrCreate(Material).albedoColor!.asArray()[3] > 0)
      stand.getComponentOrCreate(Material).albedoColor = Color4.FromColor3(color(this.frequency/60, this.lastUpdate, 3));
  }
}

// Add a new instance of the system to the engine
engine.addSystem(new FloorSystem());

class MegAvatarSystem implements ISystem {
  // this group will contain every entity that has a Transform component
  mega: boolean = false;
  camera = new Camera();
  lastUpdate = 0;
  update(dt: number) {
    this.lastUpdate += dt;
    if (this.lastUpdate < 2) return;
    this.lastUpdate = 0;
    const pos = this.camera.position.asArray();
    if (pos[0] > 16 || pos[0] < 0 || pos[2] > 16 || pos[2] < 0) {
      if (this.mega === true) return;
      this.mega = true;
      stand.getComponent(BoxShape).visible = false;
      avatar.getComponent(Transform).scale.setAll(5);
      avatar.getComponent(Transform).position.y = -3;
    } else {
      if (this.mega === false) return;
      this.mega = false;
      stand.getComponent(BoxShape).visible = true;
      avatar.getComponent(Transform).scale.setAll(1.5);
      avatar.getComponent(Transform).position.y = 0.15;
      //avatar.getComponent(Transform).rotation = new Vector3(0,0,0).toQuaternion()
    }
  }
}

// Add a new instance of the system to the engine
engine.addSystem(new MegAvatarSystem());
