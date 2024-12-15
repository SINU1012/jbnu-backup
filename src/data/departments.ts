// src/data/departments.ts
export const departments = {
  humanities: [
    { slug: "korean-language-literature", name: "국어국문학과" },
    { slug: "history", name: "사학과" },
    { slug: "philosophy", name: "철학과" },
    { slug: "english-language-literature", name: "영어영문학과" },
    { slug: "german-studies", name: "독일학과" },
    { slug: "spanish-latin-american-studies", name: "스페인ㆍ중남미학과" },
    { slug: "french-africa-studies", name: "프랑스ㆍ아프리카학과" },
    { slug: "japanese-studies", name: "일본학과" },
    { slug: "chinese-language-literature", name: "중어중문학과" },
    { slug: "archaeology-cultural-anthropology", name: "고고문화인류학과" },
    { slug: "library-information-science", name: "문헌정보학과" },
    { slug: "international-studies", name: "국제학부" },
  ],
  science: [
    { slug: "science", name: "과학학과" },
    { slug: "physics", name: "물리학과" },
    { slug: "semiconductor-science-technology", name: "반도체과학기술학과" },
    { slug: "molecular-biology", name: "생명과학부(분자생물학)" },
    { slug: "life-science", name: "생명과학부(생명과학)" },
    { slug: "mathematics", name: "수학과" },
    { slug: "sports-science", name: "스포츠과학과" },
    { slug: "earth-environmental-science", name: "지구환경과학과" },
    { slug: "statistics", name: "통계학과" },
    { slug: "chemistry", name: "화학과" },
  ],
  agriculture: [
    { slug: "agricultural-biology", name: "농생물학과" },
    { slug: "agricultural-economics", name: "농경제유통학(농업경제학)" },
    { slug: "food-distribution", name: "농경제유통학(식품유통학)" },
    { slug: "animal-bioscience", name: "동물생명공학과" },
    { slug: "animal-resource-science", name: "동물자원과학과" },
    { slug: "wood-applied-science", name: "목재응용과학과" },
    { slug: "forest-environment-science", name: "산림환경과학과" },
    {
      slug: "bio-industrial-machinery-engineering",
      name: "생물산업기계공학과",
    },
    { slug: "bio-environmental-chemistry", name: "생물환경화학과" },
    { slug: "food-engineering", name: "식품공학과" },
    { slug: "horticulture", name: "원예학과" },
    { slug: "crop-life-science", name: "작물생명과학과" },
    { slug: "landscape-architecture", name: "조경학과" },
    { slug: "regional-construction-engineering", name: "지역건설공학과" },
    { slug: "bio-resource-convergence", name: "생명자원융합학과" },
    { slug: "smart-farm", name: "스마트팜학과" },
  ],
} as const;
