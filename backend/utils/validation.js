// Validate registration data
const validateRegistration = (data) => {
  const errors = [];

  // Basic Information
  if (!data.fullName?.trim()) errors.push('Full name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  if (!data.phone?.trim()) errors.push('Phone number is required');
  if (!data.dateOfBirth) errors.push('Date of birth is required');

  // Academic Details
  if (!data.institution?.trim()) errors.push('Institution name is required');
  if (!data.degree?.trim()) errors.push('Degree/Course is required');
  if (!data.graduationYear) errors.push('Graduation year is required');
  
  // Location validation
  if (!data.location) {
    errors.push('Location information is required');
  } else {
    if (!data.location.city?.trim()) errors.push('City is required');
    if (!data.location.state?.trim()) errors.push('State is required');
    if (!data.location.country?.trim()) errors.push('Country is required');
  }

  // Team Information
  if (!data.participationType) {
    errors.push('Please select participation type (solo/team)');
  } else if (data.participationType === 'team') {
    if (!data.teamName?.trim()) errors.push('Team name is required for team participation');
    if (!Array.isArray(data.teamMembers) || data.teamMembers.length === 0) {
      errors.push('At least one team member is required for team participation');
    } else {
      // Validate team members if present
      data.teamMembers.forEach((member, index) => {
        if (!member.name?.trim()) errors.push(`Team member ${index + 1} name is required`);
        if (!member.email?.trim()) errors.push(`Team member ${index + 1} email is required`);
      });
    }
  }

  // Hackathon Details
  if (!data.track?.trim()) errors.push('Please select a track/theme');
  if (!data.skills?.trim()) errors.push('Please list your skills/technologies');

  // Logistics
  if (!data.tshirtSize) errors.push('Please select your T-shirt size');

  // Legal & Consents
  if (!data.codeOfConductConsent) errors.push('You must agree to the Code of Conduct');
  if (!data.mediaReleaseConsent) errors.push('You must agree to the media release terms');
  if (!data.termsAndConditionsConsent) errors.push('You must agree to the terms and conditions');

  return errors.length > 0 ? errors : null;
};

module.exports = {
  validateRegistration
}; 