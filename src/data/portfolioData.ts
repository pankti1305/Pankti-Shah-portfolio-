import p1Model01 from "../assets/images/model_front_lit_1794950142650.jpg";
import p1Model02 from "../assets/images/model_front_full_1794950170357.jpg";
import p1Model03 from "../assets/images/model_top_plan_1794950145157.jpg";
import p1Model04 from "../assets/images/model_aisle_view_1794950145253.jpg";
import p1Model05 from "../assets/images/model_center_lit_1794950146784.jpg";
import p1Model06 from "../assets/images/model_hair_body_1794950146759.jpg";
import p1Model07 from "../assets/images/model_lips_face_1794950146548.jpg";
import p1Model08 from "../assets/images/model_central_island_1794950149397.jpg";
import p1Model09 from "../assets/images/model_pedestal_front_1794950150824.jpg";
import p1Model10 from "../assets/images/model_billing_counter_1794950150486.jpg";
import p1Model11 from "../assets/images/model_feature_wall_1794950151482.jpg";
import p3RplanGf from "../assets/images/villa_rplan_gf_1794951226553.jpg";
import p3RplanFf from "../assets/images/villa_rplan_ff_1794951229448.jpg";
import p3RsecAa from "../assets/images/villa_rsec_aa_1794951227509.jpg";
import p3RsecBb from "../assets/images/villa_rsec_bb_1794951228865.jpg";
import p3RsecCc from "../assets/images/villa_rsec_cc_1794951229477.jpg";
import p3RsecDd from "../assets/images/villa_rsec_dd_1794951230336.jpg";
import p3BathPlan from "../assets/images/villa_bath_plan_1794951230849.webp";
import p3BathA from "../assets/images/villa_bath_a_1794951231614.webp";
import p3BathB from "../assets/images/villa_bath_b_1794951232223.webp";
import p3BathC from "../assets/images/villa_bath_c_1794951232833.webp";
import p3BathD from "../assets/images/villa_bath_d_1794951237320.webp";
import p3KitchenPlan from "../assets/images/villa_kitchen_plan_1794951235490.webp";
import p3KitchenA from "../assets/images/villa_kitchen_a_1794951235600.webp";
import p3KitchenB from "../assets/images/villa_kitchen_b_1794951236582.webp";
import p3KitchenC from "../assets/images/villa_kitchen_c_1794951236904.webp";
import p3KitchenD from "../assets/images/villa_kitchen_d_1794951237290.webp";

export const IMAGES = {
  cover: "/images/cover.webp",
  pankti: "/images/pankti.webp",
  "p1-drawings": "/images/p1-drawings.webp",
  "p1-hero": "/images/p1-hero.webp",
  "p1-model-01": p1Model01,
  "p1-model-02": p1Model02,
  "p1-model-03": p1Model03,
  "p1-model-04": p1Model04,
  "p1-model-05": p1Model05,
  "p1-model-06": p1Model06,
  "p1-model-07": p1Model07,
  "p1-model-08": p1Model08,
  "p1-model-09": p1Model09,
  "p1-model-10": p1Model10,
  "p1-model-11": p1Model11,
  "p1-rendered": "/images/p1-rendered.webp",
  "p2-concept-1": "/assets/aistudio/Gemini_Generated_Image_xodbk1xodbk1xodb_8a56b165.png",
  "p2-concept-2": "/assets/aistudio/Gemini_Generated_Image_rrfedrrrfedrrrfe_c9eef8e3.png",
  "p2-hero": "/images/p2-hero.webp",
  "p2-plan": "/images/p2-plan.webp",
  "p2-section": "/images/p2-section.webp",
  "p3-bath-a": p3BathA,
  "p3-bath-b": p3BathB,
  "p3-bath-c": p3BathC,
  "p3-bath-d": p3BathD,
  "p3-bath-plan": p3BathPlan,
  "p3-bedroom": "/images/p3-bedroom.webp",
  "p3-direction": "/images/p3-direction.webp",
  "p3-folding": "/images/p3-folding.webp",
  "p3-hero": "/images/p3-hero.webp",
  "p3-kitchen-a": p3KitchenA,
  "p3-kitchen-b": p3KitchenB,
  "p3-kitchen-c": p3KitchenC,
  "p3-kitchen-d": p3KitchenD,
  "p3-kitchen-plan": p3KitchenPlan,
  "p3-plan": "/images/p3-plan.webp",
  "p3-rplan-ff": p3RplanFf,
  "p3-rplan-gf": p3RplanGf,
  "p3-rsec-aa": p3RsecAa,
  "p3-rsec-bb": p3RsecBb,
  "p3-rsec-cc": p3RsecCc,
  "p3-rsec-dd": p3RsecDd,
  "p3-sec-ab": "/images/p3-sec-ab.webp",
  "p3-sec-cd": "/images/p3-sec-cd.webp",
  "p4-analysis": "/images/p4-analysis.webp",
  "p4-hero": "/images/p4-hero.webp",
  "p4-plan": "/images/p4-plan.webp",
  "p4-reception": "/images/p4-reception.webp",
  "p4-renders1": "/images/p4-renders1.webp",
  "p4-renders2": "/images/p4-renders2.webp",
  "p4-sec-ab": "/images/p4-sec-ab.webp",
  "p4-sec-cd": "/images/p4-sec-cd.webp",
  "p4-site": "/images/p4-site.webp",
  "p5-hero": "/images/p5-hero.webp",
  "p5-plan": "/images/p5-plan.webp",
  "p5-ref": "/images/p5-ref.webp",
  "p6-bedroom": "/images/p6-bedroom.webp",
  "p6-hero": "/images/p6-hero.webp",
  "p6-tv": "/images/p6-tv.webp",
} as const;

export type ImageKey = keyof typeof IMAGES;

export interface PaletteSwatch {
  name: string;
  color: string;
}

export const GALLERY_CATEGORIES = [
  "Site Photographs",
  "Technical Drawings",
  "Rendered Drawings",
  "3D Visualisations",
  "Physical Models",
  "Final Photographs",
  "Other Project Visuals",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type ImageSurface = "photo" | "cad" | "sheet";

export interface ProjectSheet {
  imageKey: ImageKey;
  title?: string;
  caption?: string;
  category: GalleryCategory;
  subgroup?: string;
  subgroupDesc?: string;
  subgroupLayout?: "grid-2" | "plan-elevations";
  fit?: "contain" | "cover";
  surface?: ImageSurface;
  fadeBottom?: boolean;
  panoramic?: boolean;
  ar?: string;
  span?: 3 | 4 | 6;
}

export interface Project {
  id: string;
  title: string;
  kind: string;
  sem: string;
  tag: string;
  location?: string;
  hero: ImageKey;
  heroSurface?: ImageSurface;
  ar: string;
  heroCap: string;
  brief: string;
  concept: string;
  facts: [string, string][];
  palette?: PaletteSwatch[];
  vibes?: string[];
  sheets: ProjectSheet[];
  categoryOrder?: readonly GalleryCategory[];
  categoryTitles?: Partial<Record<GalleryCategory, string>>;
  githubUrl?: string;
}

export interface GalleryGroupItem {
  sheet: ProjectSheet;
  orderedIndex: number;
}

export interface ProjectGallerySubgroup {
  title: string;
  description?: string;
  layout: "grid-2" | "plan-elevations";
  aspectRatio: string;
  items: GalleryGroupItem[];
}

export interface ProjectGalleryGroup {
  category: GalleryCategory;
  title: string;
  items: GalleryGroupItem[];
  subgroups?: ProjectGallerySubgroup[];
  aspectRatio: string;
  isPanoramic: boolean;
  isCurated: boolean;
}

export function getProjectGalleryGroups(project: Project): ProjectGalleryGroup[] {
  const groups: ProjectGalleryGroup[] = [];
  let runningIndex = 0;

  const order = project.categoryOrder ?? GALLERY_CATEGORIES;
  for (const category of order) {
    const matching = project.sheets.filter((sheet) => sheet.category === category);
    if (matching.length === 0) continue;

    const hasSubgroups = matching.some((s) => Boolean(s.subgroup));
    if (hasSubgroups) {
      const subMap = new Map<string, ProjectSheet[]>();
      for (const s of matching) {
        const key = s.subgroup ?? "Other";
        const list = subMap.get(key) ?? [];
        list.push(s);
        subMap.set(key, list);
      }

      const subgroups: ProjectGallerySubgroup[] = [];
      const flatItems: GalleryGroupItem[] = [];

      for (const [subTitle, subSheets] of subMap.entries()) {
        const subItems: GalleryGroupItem[] = subSheets.map((sheet) => {
          const entry = { sheet, orderedIndex: runningIndex++ };
          flatItems.push(entry);
          return entry;
        });
        const layout = subSheets.find((s) => s.subgroupLayout)?.subgroupLayout ?? "grid-2";
        const description = subSheets.find((s) => s.subgroupDesc)?.subgroupDesc;
        const aspectRatio = subSheets[0]?.ar ?? "16/11";
        subgroups.push({
          title: subTitle,
          description,
          layout,
          aspectRatio,
          items: subItems,
        });
      }

      groups.push({
        category,
        title: project.categoryTitles?.[category] ?? category,
        items: flatItems,
        subgroups,
        aspectRatio: "16/11",
        isPanoramic: false,
        isCurated: false,
      });
      continue;
    }

    const isCurated = matching.some((s) => typeof s.span === "number");
    const isPanoramic = !isCurated && matching.length === 1 && Boolean(matching[0].panoramic);
    const isSquareSet = matching.every((s) => s.ar === "1/1");
    const aspectRatio =
      isPanoramic && matching[0].ar
        ? matching[0].ar
        : isSquareSet
          ? "1/1"
          : "16/11";

    const items: GalleryGroupItem[] = matching.map((sheet) => ({
      sheet,
      orderedIndex: runningIndex++,
    }));

    groups.push({
      category,
      title: project.categoryTitles?.[category] ?? category,
      items,
      aspectRatio,
      isPanoramic,
      isCurated,
    });
  }

  return groups;
}

export function getOrderedProjectSheets(project: Project): ProjectSheet[] {
  return getProjectGalleryGroups(project).flatMap((group) =>
    group.items.map((item) => item.sheet)
  );
}

export const SITE_LINKS = {
  github: "https://github.com/pankti1305",
  instagram: "https://www.instagram.com/panktii__.13/",
  instagramHandle: "@panktii__.13",
  email: "pankti1305@gmail.com",
  phone: "+91 63544 38221",
  phoneHref: "tel:+916354438221",
  location: "Ahmedabad, Gujarat",
} as const;

export const PROJECTS: Project[] = [
  {
    id: "lushe-glow",
    title: "Lushe’ Glow",
    kind: "Beauty retail store",
    sem: "Semester 4",
    tag: "Skin, makeup, fragrance and self care",
    hero: "p1-hero",
    ar: "807/485",
    heroCap: "Physical model of the store, central display and wall units",
    brief:
      "A contemporary beauty store that feels inviting and easy to shop. The brief asked for clear product display, circulation, lighting, billing and storage, laid out so customers want to explore and interact with the products.",
    concept:
      "Drawing on the retail experience of Nykaa and Sephora, the store pairs bold burgundy walls with a pale marble floor and a sculpted central display. Products are zoned by category, from haircare and bodycare to lips, eyes and face, so the room reads at a glance.",
    facts: [
      ["Type", "Beauty and cosmetics retail"],
      ["Case studies", "Nykaa, Sephora"],
      ["Focus", "Retail planning, product display, customer experience, lighting, materiality"],
      ["Key spaces", "Product display, central display, billing, storage, trial and mirror area"],
    ],
    palette: [
      { name: "Burgundy", color: "#6E1F27" },
      { name: "Matte black", color: "#2B2B2B" },
      { name: "Warm wood", color: "#9A5F33" },
      { name: "Cream", color: "#F3E8CF" },
    ],
    vibes: ["Modern and stylish", "Positive", "Approachable", "Fresh and playful"],
    sheets: [
      {
        imageKey: "p1-drawings",
        caption: "Plan, billing counter details, elevations and sections",
        category: "Technical Drawings",
        fit: "contain",
        surface: "cad",
        ar: "1700/1168",
      },
      {
        imageKey: "p1-rendered",
        caption: "Rendered plan, billing counter and elevations",
        category: "Rendered Drawings",
        fit: "contain",
        surface: "sheet",
        ar: "1700/1168",
      },
      {
        imageKey: "p1-model-01",
        caption: "Front interior perspective showing warm lighting and product zoning",
        category: "Physical Models",
        fit: "cover",
        surface: "photo",
        ar: "16/9",
        span: 6,
      },
      {
        imageKey: "p1-model-02",
        caption: "Full interior perspective of wall units and central island",
        category: "Physical Models",
        fit: "cover",
        surface: "photo",
        ar: "16/9",
        span: 6,
      },
      {
        imageKey: "p1-model-03",
        caption: "Top-down plan view of the scale model layout",
        category: "Physical Models",
        fit: "cover",
        surface: "photo",
        ar: "1/1",
        span: 4,
      },
      {
        imageKey: "p1-model-04",
        caption: "Aisle perspective toward the back feature wall and ceiling spotlights",
        category: "Physical Models",
        fit: "cover",
        surface: "photo",
        ar: "1/1",
        span: 4,
      },
      {
        imageKey: "p1-model-05",
        caption: "Central display alignment along the main circulation aisle",
        category: "Physical Models",
        fit: "cover",
        surface: "photo",
        ar: "1/1",
        span: 4,
      },
      {
        imageKey: "p1-model-06",
        caption: "Hair Care and Body Care wall display units",
        category: "Physical Models",
        fit: "cover",
        surface: "photo",
        ar: "3/4",
        span: 3,
      },
      {
        imageKey: "p1-model-07",
        caption: "Lips, Eyes and Face wall display units",
        category: "Physical Models",
        fit: "cover",
        surface: "photo",
        ar: "3/4",
        span: 3,
      },
      {
        imageKey: "p1-model-08",
        caption: "Central display island and arched wall elevation",
        category: "Physical Models",
        fit: "cover",
        surface: "photo",
        ar: "3/4",
        span: 3,
      },
      {
        imageKey: "p1-model-09",
        caption: "Front detail of the sculpted central display pedestal",
        category: "Physical Models",
        fit: "cover",
        surface: "photo",
        ar: "3/4",
        span: 3,
      },
      {
        imageKey: "p1-model-10",
        caption: "Fluted billing counter with brass trim detail",
        category: "Physical Models",
        fit: "cover",
        surface: "photo",
        ar: "3/2",
        span: 6,
      },
      {
        imageKey: "p1-model-11",
        caption: "Lushe’ Glow feature wall and brass frame detail",
        category: "Physical Models",
        fit: "cover",
        surface: "photo",
        ar: "3/2",
        span: 6,
      },
    ],
    githubUrl: "https://github.com/pankti1305/lushe-glow-retail-design",
  },
  {
    id: "block-and-flow",
    title: "Block and Flow",
    kind: "Pre-school to Grade 1",
    sem: "Semester 5",
    tag: "Learn, play, grow",
    location: "Bhilwara, Rajasthan",
    hero: "p2-hero",
    ar: "939/508",
    heroCap: "Courtyard view of the school and play areas",
    brief:
      "A safe, engaging school for pre-primary to Grade 1 children, their teachers and staff, with age-appropriate learning spaces, play areas and room to interact. The design responds to Bhilwara’s hot, dry climate.",
    concept:
      "Block and Flow combines playful building blocks with organic movement. Simple geometric blocks hold the classrooms, while softer, flowing forms carry circulation and play, so the school feels connected, safe and full of discovery for young children.",
    facts: [
      ["Type", "Educational, school design"],
      ["Location", "Bhilwara, Rajasthan"],
      ["Users", "Pre-primary to Grade 1 students, teachers, staff"],
      [
        "Case studies",
        "Rajkumari Ratnavati Girls’ School, MCD Pratibha Vidyalaya, Panyaden International School, Toy Story Play School",
      ],
      ["Focus", "Child-centred design, learning spaces, play and interaction, climate-responsive design, safety"],
      ["Key spaces", "Classrooms, activity spaces, play areas, multipurpose space, administration, washrooms"],
    ],
    sheets: [
      {
        imageKey: "p2-plan",
        caption: "Ground plan with classroom, toilet and activity room elevations",
        category: "Technical Drawings",
        fit: "contain",
        surface: "cad",
        ar: "1700/1168",
      },
      {
        imageKey: "p2-section",
        caption: "Section AA’ and early concept sketches",
        category: "Technical Drawings",
        fit: "contain",
        surface: "sheet",
        ar: "1700/1168",
      },
      {
        imageKey: "p2-concept-1",
        caption: "Concept sketches for the Bhilwara site — design ideas",
        category: "Other Project Visuals",
        fit: "contain",
        surface: "photo",
        ar: "1/1",
      },
      {
        imageKey: "p2-concept-2",
        caption: "Concept sketches for the Bhilwara site — forms and zoning",
        category: "Other Project Visuals",
        fit: "contain",
        surface: "photo",
        ar: "1/1",
      },
    ],
    githubUrl: "https://github.com/pankti1305/block-and-flow-school-design",
  },
  {
    id: "villa",
    title: "Residential Villa",
    kind: "Contemporary residence",
    sem: "Semester 4, CAD",
    tag: "Live, relax, connect, gather, comfort",
    hero: "p3-hero",
    ar: "695/562",
    heroCap: "The villa that the interior scheme was developed for",
    brief:
      "The interior design of a given villa in an individually chosen style, covering the planning and detailing of every room with furniture, materials, colours, lighting and space requirements in mind.",
    concept:
      "A contemporary approach built on clean forms, functional planning and a balanced material palette. Modern furniture, subtle colours and layered lighting make rooms that feel comfortable, refined and practical for everyday living.",
    facts: [
      ["Type", "Residential interior design"],
      ["Subject", "Computer-aided design"],
      ["Style", "Contemporary"],
      ["Focus", "Space planning, furniture layout, material selection, colour palette, lighting, detailing"],
      ["Key spaces", "Living room, dining, kitchen, bedrooms, bathrooms, terrace and lounge"],
    ],
    sheets: [
      {
        imageKey: "p3-direction",
        caption: "Design direction: style, materials, furniture and lighting",
        category: "Other Project Visuals",
        fit: "contain",
        surface: "photo",
        panoramic: true,
        ar: "1881/367",
      },
      {
        imageKey: "p3-plan",
        caption: "Ground and first floor plans",
        category: "Technical Drawings",
        fit: "contain",
        surface: "cad",
        ar: "1700/1168",
      },
      {
        imageKey: "p3-rplan-gf",
        title: "Ground Floor Plan",
        caption: "Living and dining areas, courtyard water feature, two bedrooms, and driveway parking",
        category: "Rendered Drawings",
        subgroup: "Floor Plans",
        subgroupDesc:
          "Colour-rendered floor plans showing spatial layout, furniture arrangement, central water feature, garden zoning, and upper-level leisure deck.",
        subgroupLayout: "grid-2",
        fit: "contain",
        surface: "photo",
        ar: "1/1",
      },
      {
        imageKey: "p3-rplan-ff",
        title: "First Floor Plan",
        caption: "Master bedroom suite, terrace swimming pool, outdoor deck, and snooker lounge",
        category: "Rendered Drawings",
        subgroup: "Floor Plans",
        fit: "contain",
        surface: "photo",
        ar: "1/1",
      },
      {
        imageKey: "p3-sec-ab",
        caption: "Sections AA’ and BB’",
        category: "Technical Drawings",
        fit: "contain",
        surface: "cad",
        ar: "1700/1168",
      },
      {
        imageKey: "p3-sec-cd",
        caption: "Sections CC’ and DD’",
        category: "Technical Drawings",
        fit: "contain",
        surface: "cad",
        ar: "1700/1168",
      },
      {
        imageKey: "p3-rsec-aa",
        title: "Section AA’",
        category: "Rendered Drawings",
        subgroup: "Architectural Sections",
        subgroupLayout: "grid-2",
        fit: "contain",
        surface: "photo",
        fadeBottom: true,
        ar: "1376/768",
      },
      {
        imageKey: "p3-rsec-bb",
        title: "Section BB’",
        category: "Rendered Drawings",
        subgroup: "Architectural Sections",
        fit: "contain",
        surface: "photo",
        fadeBottom: true,
        ar: "1376/768",
      },
      {
        imageKey: "p3-rsec-cc",
        title: "Section CC’",
        category: "Rendered Drawings",
        subgroup: "Architectural Sections",
        fit: "contain",
        surface: "photo",
        fadeBottom: true,
        ar: "1376/768",
      },
      {
        imageKey: "p3-rsec-dd",
        title: "Section DD’",
        category: "Rendered Drawings",
        subgroup: "Architectural Sections",
        fit: "contain",
        surface: "photo",
        fadeBottom: true,
        ar: "1376/768",
      },
      {
        imageKey: "p3-bedroom",
        caption: "Bedroom plan and elevations",
        category: "Technical Drawings",
        fit: "contain",
        surface: "cad",
        ar: "1700/1168",
      },
      {
        imageKey: "p3-folding",
        caption: "Bedroom folding plan and wall elevations",
        category: "Technical Drawings",
        fit: "contain",
        surface: "cad",
        ar: "1700/1168",
      },
      {
        imageKey: "p3-bath-plan",
        title: "Bathroom Floor Plan",
        category: "Rendered Drawings",
        subgroup: "Bathroom — Plan & Elevations",
        subgroupLayout: "plan-elevations",
        fit: "contain",
        surface: "photo",
        ar: "846/1185",
      },
      {
        imageKey: "p3-bath-a",
        title: "Elevation A",
        category: "Rendered Drawings",
        subgroup: "Bathroom — Plan & Elevations",
        fit: "contain",
        surface: "photo",
        ar: "753/1344",
      },
      {
        imageKey: "p3-bath-b",
        title: "Elevation B",
        category: "Rendered Drawings",
        subgroup: "Bathroom — Plan & Elevations",
        fit: "contain",
        surface: "photo",
        ar: "896/1156",
      },
      {
        imageKey: "p3-bath-c",
        title: "Elevation C",
        category: "Rendered Drawings",
        subgroup: "Bathroom — Plan & Elevations",
        fit: "contain",
        surface: "photo",
        ar: "768/1350",
      },
      {
        imageKey: "p3-bath-d",
        title: "Elevation D",
        category: "Rendered Drawings",
        subgroup: "Bathroom — Plan & Elevations",
        fit: "contain",
        surface: "photo",
        ar: "870/1165",
      },
      {
        imageKey: "p3-kitchen-plan",
        title: "Kitchen & Dining Plan",
        category: "Rendered Drawings",
        subgroup: "Kitchen & Dining — Plan & Elevations",
        subgroupLayout: "plan-elevations",
        fit: "contain",
        surface: "photo",
        ar: "887/1184",
      },
      {
        imageKey: "p3-kitchen-a",
        title: "Elevation A",
        category: "Rendered Drawings",
        subgroup: "Kitchen & Dining — Plan & Elevations",
        fit: "contain",
        surface: "photo",
        ar: "1356/763",
      },
      {
        imageKey: "p3-kitchen-b",
        title: "Elevation B",
        category: "Rendered Drawings",
        subgroup: "Kitchen & Dining — Plan & Elevations",
        fit: "contain",
        surface: "photo",
        ar: "1354/759",
      },
      {
        imageKey: "p3-kitchen-c",
        title: "Elevation C",
        category: "Rendered Drawings",
        subgroup: "Kitchen & Dining — Plan & Elevations",
        fit: "contain",
        surface: "photo",
        ar: "998/1007",
      },
      {
        imageKey: "p3-kitchen-d",
        title: "Elevation D",
        category: "Rendered Drawings",
        subgroup: "Kitchen & Dining — Plan & Elevations",
        fit: "contain",
        surface: "photo",
        ar: "1000/898",
      },
    ],
    githubUrl: "https://github.com/pankti1305/residential-villa-interior-design",
  },
  {
    id: "hotel",
    title: "Five Star Hotel",
    kind: "Adaptive reuse",
    sem: "Semester 6",
    tag: "Preserve, reimagine, revive, experience",
    location: "RC College, Ahmedabad",
    hero: "p4-hero",
    ar: "925/433",
    heroCap: "The existing RC College building in Ahmedabad",
    brief:
      "Turn the existing RC College building into a five-star hotel while keeping the character of the structure. The project covers reception, banquet, indoor and outdoor dining, guest rooms and the landscape around them.",
    concept:
      "The college gets a new purpose without losing its arches and red brick. Bohemian interiors bring earthy tones, natural textures and expressive furniture, while a water channel, bridges and indoor-outdoor dining tie heritage and hospitality together.",
    facts: [
      ["Type", "Hospitality, adaptive reuse"],
      ["Existing building", "RC College, Ahmedabad"],
      ["Approach", "Adaptive reuse with Bohemian-inspired interiors"],
      ["Focus", "Heritage conservation, building transformation, hospitality planning, interiors, landscape"],
      [
        "Key spaces",
        "Reception and lobby, banquet hall, indoor and outdoor restaurant, guest rooms, service areas, water feature",
      ],
    ],
    palette: [
      { name: "Brick", color: "#A65A3F" },
      { name: "Sand", color: "#E6D3BC" },
      { name: "Ochre", color: "#D29A2C" },
      { name: "Clay", color: "#B9774C" },
      { name: "Forest", color: "#2F4430" },
    ],
    sheets: [
      {
        imageKey: "p4-site",
        caption: "The site today: arches, towers and timber doors",
        category: "Site Photographs",
        fit: "contain",
        surface: "photo",
        panoramic: true,
        ar: "1998/393",
      },
      {
        imageKey: "p4-analysis",
        caption: "Site analysis, moodboard and arch study",
        category: "Other Project Visuals",
        fit: "contain",
        surface: "sheet",
        ar: "1700/1168",
      },
      {
        imageKey: "p4-plan",
        caption: "Ground and first floor plans",
        category: "Rendered Drawings",
        fit: "contain",
        surface: "sheet",
        ar: "1700/1168",
      },
      {
        imageKey: "p4-sec-ab",
        caption: "Sections AA’ and BB’",
        category: "Rendered Drawings",
        fit: "contain",
        surface: "sheet",
        ar: "1700/1168",
      },
      {
        imageKey: "p4-sec-cd",
        caption: "Sections CC’ and DD’",
        category: "Rendered Drawings",
        fit: "contain",
        surface: "sheet",
        ar: "1700/1168",
      },
      {
        imageKey: "p4-reception",
        caption: "Reception renders",
        category: "3D Visualisations",
        fit: "contain",
        surface: "photo",
        ar: "980/844",
      },
      {
        imageKey: "p4-renders1",
        caption: "Restaurant and standard room renders",
        category: "3D Visualisations",
        fit: "contain",
        surface: "sheet",
        ar: "1700/1168",
      },
      {
        imageKey: "p4-renders2",
        caption: "Reception and deluxe room renders",
        category: "3D Visualisations",
        fit: "contain",
        surface: "sheet",
        ar: "1700/1168",
      },
    ],
    categoryOrder: [
      "Site Photographs",
      "Other Project Visuals",
      "Technical Drawings",
      "Rendered Drawings",
      "3D Visualisations",
      "Physical Models",
      "Final Photographs",
    ],
    categoryTitles: {
      "Other Project Visuals": "Site Analysis , Moodboard and About Structure",
    },
    githubUrl: "https://github.com/pankti1305/rc-college-hotel-adaptive-reuse",
  },
  {
    id: "manek-chowk",
    title: "Manek Chowk",
    kind: "Multifunctional space",
    sem: "Studio project",
    tag: "A beauty store and furniture gallery in one",
    location: "Manek Chowk, Ahmedabad",
    hero: "p5-hero",
    ar: "580/536",
    heroCap: "Concept view of the beauty store counter",
    brief:
      "Transform an existing space at Manek Chowk into a working commercial environment with a beauty store and a furniture exhibition space, using careful space planning, product display and activity zoning.",
    concept:
      "The existing structure is reused and given a new purpose. Separate zones for the beauty store and the furniture gallery make better use of the space, creating a place that draws people in throughout the day.",
    facts: [
      ["Type", "Commercial interior design, adaptive reuse"],
      ["Location", "Manek Chowk, Ahmedabad"],
      ["Programme", "Beauty retail store, furniture exhibition space"],
      ["Focus", "Space planning, retail design, product display, functional zoning"],
    ],
    palette: [
      { name: "Olive", color: "#4E4A1F" },
      { name: "Moss", color: "#8C9A4A" },
      { name: "Tan", color: "#B07A4E" },
      { name: "Linen", color: "#EADBC6" },
      { name: "Espresso", color: "#2A1B16" },
    ],
    sheets: [
      {
        imageKey: "p5-ref",
        caption: "Reference imagery for furniture and display",
        category: "Other Project Visuals",
        fit: "contain",
        surface: "photo",
        ar: "820/606",
      },
      {
        imageKey: "p5-plan",
        caption: "Moodboard, plan and sections",
        category: "Technical Drawings",
        fit: "contain",
        surface: "sheet",
        ar: "1700/1168",
      },
    ],
    githubUrl: "https://github.com/pankti1305/manek-chowk-multifunctional-space",
  },
  {
    id: "training",
    title: "Training Work",
    kind: "Residential details",
    sem: "Additional work",
    tag: "Furniture and wall design options",
    hero: "p6-hero",
    heroSurface: "cad",
    ar: "683/389",
    heroCap: "Bedroom wall design options with material callouts",
    brief:
      "Working drawings produced during training: design options for a bedroom wall and TV unit, and a dimensioned technical drawing of a wardrobe.",
    concept:
      "Each option is drawn with its finishes called out, from PU flutes and wooden patta to mirror and MDF finishes, so a client can compare the choices and a carpenter can build from the drawing.",
    facts: [
      ["Type", "Residential interior detailing"],
      ["Drawings", "Bedroom design options, TV unit design options, wardrobe technical drawing"],
    ],
    sheets: [
      {
        imageKey: "p6-bedroom",
        caption: "Bedroom design options",
        category: "Rendered Drawings",
        fit: "contain",
        surface: "cad",
        ar: "1700/960",
      },
      {
        imageKey: "p6-tv",
        caption: "TV unit options and wardrobe technical drawing",
        category: "Technical Drawings",
        fit: "contain",
        surface: "cad",
        ar: "1700/1168",
      },
    ],
    githubUrl: "https://github.com/pankti1305/interior-training-work",
  },
];

export interface TimelineEntry {
  period: string;
  title: string;
  institution: string;
}

export const EDUCATION: TimelineEntry[] = [
  {
    period: "2023–2027",
    title: "Bachelor of Design, Interior Design",
    institution: "Indus Design School, Indus University, Ahmedabad",
  },
  {
    period: "2008–2023",
    title: "Elementary to higher secondary",
    institution: "Divan Ballubhai School, Ahmedabad",
  },
];

export const EXPERIENCE: TimelineEntry[] = [
  {
    period: "April–June 2026",
    title: "Office design",
    institution: "JDH Caterers",
  },
  {
    period: "December 2025",
    title: "Design training",
    institution: "Aastha Design Studio",
  },
];

export interface SkillGroup {
  category: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  {
    category: "Design",
    items: [
      "Material selection",
      "Colour selection and colour theory",
      "Moodboard development",
      "Presentation design",
      "Design research",
    ],
  },
  {
    category: "By hand",
    items: ["Sketching", "Basic drafting", "Model making"],
  },
  {
    category: "Software",
    items: ["AutoCAD", "SketchUp", "Photoshop", "Illustrator", "MS Excel", "MS PowerPoint"],
  },
  {
    category: "Crafts",
    items: ["Clay modelling", "Pottery", "Lippan art", "Dot mandala", "Wall painting"],
  },
];
