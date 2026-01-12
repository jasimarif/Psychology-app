
const SPECIALTY_MAPPING = {
  'Depression': ['depression', 'mood disorders', 'clinical depression'],
  'Anxiety': ['anxiety', 'anxiety disorders', 'generalized anxiety', 'panic disorder'],
  'Stress Management': ['stress', 'stress management', 'burnout', 'work stress'],
  'Relationship Issues': ['relationships', 'relationship issues', 'couples therapy', 'marriage counseling'],
  'Trauma & PTSD': ['trauma', 'ptsd', 'post-traumatic stress', 'trauma therapy'],
  'Grief & Loss': ['grief', 'loss', 'bereavement', 'grief counseling'],
  'Self-Esteem': ['self-esteem', 'confidence', 'self-worth', 'personal growth'],
  'Career Counseling': ['career', 'career counseling', 'work issues', 'professional development'],
  'Family Issues': ['family', 'family therapy', 'family counseling', 'parenting'],
  'Addiction': ['addiction', 'substance abuse', 'alcoholism', 'drug addiction'],
  'Eating Disorders': ['eating disorders', 'anorexia', 'bulimia', 'binge eating'],
  'Other': []
};

const THERAPY_TYPE_SPECIALTIES = {
  'therapy': ['individual therapy', 'adult therapy'],
  'teen': ['teen therapy', 'adolescent therapy', 'child therapy', 'youth counseling'],
  'couples': ['couples therapy', 'marriage counseling', 'relationship counseling']
};

const calculateMatchScore = (userProfile, psychologist) => {
  let totalScore = 0;
  const breakdown = {
    specialtyScore: 0,
    languageScore: 0,
    locationScore: 0,
    genderPreferenceScore: 0,
    experienceScore: 0
  };

  const psychSpecialties = (psychologist.specialties || []).map(s => s.toLowerCase());
  const psychLanguages = (psychologist.languages || []).map(l => l.toLowerCase());
  const psychLocation = (psychologist.location || '').toLowerCase();

  // Match therapy reasons to psychologist specialties
  const userReasons = userProfile.therapyReasons || [];
  let specialtyMatches = 0;
  let totalPossibleMatches = userReasons.length || 1;

  userReasons.forEach(reason => {
    const mappedSpecialties = SPECIALTY_MAPPING[reason] || [];
    const hasMatch = mappedSpecialties.some(specialty =>
      psychSpecialties.some(ps => ps.includes(specialty) || specialty.includes(ps))
    );
    if (hasMatch) specialtyMatches++;
  });

  // Also check therapy type match
  const therapyType = userProfile.therapyType || '';
  const typeSpecialties = THERAPY_TYPE_SPECIALTIES[therapyType] || [];
  const hasTypeMatch = typeSpecialties.some(ts =>
    psychSpecialties.some(ps => ps.includes(ts) || ts.includes(ps))
  );

  if (hasTypeMatch) {
    specialtyMatches += 0.5; 
  }

  breakdown.specialtyScore = Math.min(40, Math.round((specialtyMatches / totalPossibleMatches) * 40));
  totalScore += breakdown.specialtyScore;

  // 2. LANGUAGE MATCHING 
  const userLanguages = (userProfile.preferredLanguages || []).map(l => l.toLowerCase());

  if (userLanguages.length > 0) {
    const languageMatches = userLanguages.filter(ul =>
      psychLanguages.some(pl => pl.includes(ul) || ul.includes(pl))
    ).length;
    breakdown.languageScore = Math.min(25, Math.round((languageMatches / userLanguages.length) * 25));
  } else {
    breakdown.languageScore = 15;
  }
  totalScore += breakdown.languageScore;

  // 3. LOCATION MATCHING (15 points max)
  const userCountry = (userProfile.country || '').toLowerCase();

  if (userCountry && psychLocation) {
    if (psychLocation.includes(userCountry) || userCountry.includes(psychLocation)) {
      breakdown.locationScore = 15;
    } else {
      // Partial score if not exact match (for online availability)
      breakdown.locationScore = 5;
    }
  } else {
    breakdown.locationScore = 5;
  }
  totalScore += breakdown.locationScore;

  // 4. THERAPIST GENDER PREFERENCE (10 points max)
  const genderPref = userProfile.preferredTherapist || 'no-preference';
  const psychGender = (psychologist.gender || '').toLowerCase();

  if (genderPref === 'no-preference') {
    breakdown.genderPreferenceScore = 10;
  } else if (!psychGender) {
    // Psychologist hasn't set their gender
    breakdown.genderPreferenceScore = 5;
  } else if (genderPref === psychGender) {
    // Exact match
    breakdown.genderPreferenceScore = 10;
  } else {
    // Gender doesn't match preference
    breakdown.genderPreferenceScore = 2;
  }
  totalScore += breakdown.genderPreferenceScore;

  // 5. EXPERIENCE BONUS (10 points max)
  const experience = parseInt(psychologist.experience) || 0;

  if (experience >= 10) {
    breakdown.experienceScore = 10;
  } else if (experience >= 5) {
    breakdown.experienceScore = 7;
  } else if (experience >= 3) {
    breakdown.experienceScore = 5;
  } else {
    breakdown.experienceScore = 3;
  }
  totalScore += breakdown.experienceScore;

  return {
    score: totalScore,
    maxScore: 100,
    percentage: totalScore,
    breakdown
  };
};


const getRecommendations = (userProfile, psychologists, options = {}) => {
  const { limit = 20, minScore = 0 } = options;

  if (!userProfile || !psychologists || psychologists.length === 0) {
    return psychologists || [];
  }

  // Calculate match scores for all psychologists
  const scoredPsychologists = psychologists.map(psychologist => {
    const matchResult = calculateMatchScore(userProfile, psychologist);
    return {
      ...psychologist.toObject ? psychologist.toObject() : psychologist,
      matchScore: matchResult.score,
      matchPercentage: matchResult.percentage,
      matchBreakdown: matchResult.breakdown
    };
  });

  // Filter by minimum score and sort by match score (descending)
  const recommendations = scoredPsychologists
    .filter(p => p.matchScore >= minScore)
    .sort((a, b) => {
      // Primary sort: match score
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      // Secondary sort: rating
      if (b.rating !== a.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      return (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0);
    });

  return limit > 0 ? recommendations.slice(0, limit) : recommendations;
};

export {
  calculateMatchScore,
  getRecommendations,
  SPECIALTY_MAPPING,
  THERAPY_TYPE_SPECIALTIES
};
