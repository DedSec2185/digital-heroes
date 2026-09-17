// ==============================================================================
// DIGITAL HEROES (Level 1) - Tangible Philanthropic Impact Calculator (§ 08)
// Translates subscription donation amounts into tangible real-world outcomes
// ==============================================================================

import { CharityCategory } from '../types';

export interface TangibleImpact {
  headline: string;
  metricNumber: string;
  metricUnit: string;
  secondaryOutcome: string;
  equivalentRounds: string;
}

export class ImpactCalculator {
  static getTangibleImpact(category: CharityCategory, monthlyAmount: number): TangibleImpact {
    const annualAmount = monthlyAmount * 12;

    switch (category) {
      case 'Environment & Conservation': {
        const lbsPlastic = Math.round(monthlyAmount * 5);
        const annualLbs = Math.round(annualAmount * 5);
        return {
          headline: 'Marine Habitat Restoration',
          metricNumber: `${lbsPlastic} lbs`,
          metricUnit: 'of ocean plastic recovered monthly',
          secondaryOutcome: `${annualLbs} lbs/year + 2 coral micro-fragments planted`,
          equivalentRounds: `Equivalent to cleaning 140 meters of shoreline per 5 rounds`,
        };
      }
      case 'Youth & Education': {
        const mentorshipHours = Math.max(1, Math.round(monthlyAmount * 0.5));
        return {
          headline: 'Next-Gen Mentorship & Athletics',
          metricNumber: `${mentorshipHours} hrs`,
          metricUnit: 'of 1-on-1 coaching & tutoring funded',
          secondaryOutcome: `Supplies full youth junior golf kits to local schools`,
          equivalentRounds: `Equivalent to 1 full life-skills academy semester per year`,
        };
      }
      case 'Health & Research': {
        const testKits = Math.max(1, Math.round(monthlyAmount * 0.8));
        return {
          headline: 'Immunotherapy Diagnostics Acceleration',
          metricNumber: `${testKits}`,
          metricUnit: 'early-detection biopsy kits subsidized',
          secondaryOutcome: `Funds outpatient family lodging grants during treatment`,
          equivalentRounds: `Directly accelerates clinical trial diagnostics`,
        };
      }
      case 'Veterans & First Responders': {
        const adaptiveSessions = Math.max(1, Math.round(monthlyAmount * 0.4));
        return {
          headline: 'Adaptive Athletics & Career Transition',
          metricNumber: `${adaptiveSessions}`,
          metricUnit: 'adaptive sports recovery sessions',
          secondaryOutcome: `Provides tech certification mentoring to transition veterans`,
          equivalentRounds: `Supports full rehabilitation program access`,
        };
      }
      default: {
        const mealsProvided = Math.round(monthlyAmount * 4);
        return {
          headline: 'Community Nourishment & Relief',
          metricNumber: `${mealsProvided}`,
          metricUnit: 'nutritious meals delivered to families',
          secondaryOutcome: `Powers zero-waste food recovery logistics`,
          equivalentRounds: `Frees community partners to scale hot meal programs`,
        };
      }
    }
  }
}
