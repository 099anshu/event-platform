import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const token = localStorage.getItem('token');
    
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',

    // Academic/Professional Details
    institution: '',
    degree: '',
    graduationYear: '',
    location: {
      city: '',
      state: '',
      country: ''
    },

    // Team Information
    participationType: 'solo', // 'solo' or 'team'
    teamName: '',
    teamMembers: [{ name: '', email: '' }],

    // Hackathon Details
    track: '',
    skills: '',
    projectIdea: '',
    portfolioLinks: {
      github: '',
      linkedin: '',
      portfolio: ''
    },

    // Logistics
    tshirtSize: '',
    requiresAccommodation: false,
    dietaryPreferences: '',

    // Legal & Consents
    codeOfConductConsent: false,
    parentalConsent: false,
    mediaReleaseConsent: false,
    termsAndConditionsConsent: false,

    // Optional Questions
    howDidYouHear: '',
    expectedLearning: ''
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!token) {
      toast.error('Please login to register for events');
      navigate('/login', { state: { from: `/register/${eventId}` } });
      return;
    }

    fetchEventDetails();
    fetchExistingRegistration();
  }, [eventId, navigate, token]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
      navigate('/events');
      } finally {
        setLoading(false);
      }
    };

  const fetchExistingRegistration = async () => {
    try {
      const response = await axios.get(`/api/registrations/event/${eventId}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const registration = response.data.data;
        setFormData(registration);
        setCurrentStep(registration.currentStep);
      }
    } catch (error) {
      // If no registration exists, that's fine - we'll start fresh
      if (error.response?.status !== 404) {
        console.error('Error fetching registration:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTeamMemberChange = (index, field, value) => {
    setFormData(prev => {
      const newTeamMembers = [...prev.teamMembers];
      newTeamMembers[index] = {
        ...newTeamMembers[index],
        [field]: value
      };
      return {
        ...prev,
        teamMembers: newTeamMembers
      };
    });
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', email: '' }]
    }));
  };

  const removeTeamMember = (index) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  // Helper: Validate required fields before submit
  const validateRequiredFields = () => {
    const requiredFields = [
      'fullName', 'email', 'phone', 'dateOfBirth', 'gender',
      'institution', 'degree', 'graduationYear',
      'track', 'skills', 'tshirtSize',
    ];
    for (const field of requiredFields) {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        return `Please fill the required field: ${field}`;
      }
    }
    if (!formData.location.city || !formData.location.state || !formData.location.country) {
      return 'Please fill all location fields (city, state, country)';
    }
    if (!formData.codeOfConductConsent || !formData.mediaReleaseConsent || !formData.termsAndConditionsConsent) {
      return 'You must agree to all required consents.';
    }
    if (formData.participationType === 'team') {
      if (!formData.teamName || formData.teamName.trim() === '') {
        return 'Please provide a team name.';
      }
      if (!formData.teamMembers || formData.teamMembers.length === 0) {
        return 'Please add at least one team member.';
      }
      for (const [i, member] of formData.teamMembers.entries()) {
        if (!member.name || !member.email) {
          return `Please fill name and email for team member ${i + 1}`;
        }
      }
    }
    // tshirtSize must be one of allowed values
    const allowedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    if (!allowedSizes.includes(formData.tshirtSize)) {
      return 'Please select a valid T-shirt size.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Frontend validation
    const validationError = validateRequiredFields();
    if (validationError) {
      toast.error(validationError);
      setSubmitting(false);
      return;
    }

    try {
      // Log the data being sent
      console.log('Submitting registration data:', {
        eventId,
        ...formData
      });

      const response = await axios.post('/api/registrations/submit', {
        eventId,
        ...formData
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Registration response:', response.data);

      if (response.data.success) {
        toast.success('Registration submitted successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.data?.error && Array.isArray(error.response.data.error)) {
        toast.error(error.response.data.error.join(', '));
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit registration');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderProgressBar = () => {
    const steps = [
      'Basic Information',
      'Academic Details',
      'Team Information',
      'Hackathon Details',
      'Logistics',
      'Legal & Consents',
      'Optional Questions'
    ];

    return (
      <div className=" w-full py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="relative">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  index + 1 === currentStep ? 'bg-indigo-600 text-white' :
                  index + 1 < currentStep ? 'bg-green-500 text-white' :
                  'bg-gray-300'
                }`}>
                  {index + 1 < currentStep ? '✓' : index + 1}
                </div>
                <div className="mt-2 text-xs text-center">{step}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${
                  index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderBasicInformation = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAcademicDetails = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Academic/Professional Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Institution *</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Degree/Course *</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Graduation Year *</label>
          <input
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            min={new Date().getFullYear()}
            max={new Date().getFullYear() + 6}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City *</label>
          <input
            type="text"
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State *</label>
          <input
            type="text"
            name="location.state"
            value={formData.location.state}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country *</label>
          <input
            type="text"
            name="location.country"
            value={formData.location.country}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const renderTeamInformation = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Team Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Participation Type *</label>
          <select
            name="participationType"
            value={formData.participationType}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="solo">Solo</option>
            <option value="team">Team</option>
          </select>
        </div>

        {formData.participationType === 'team' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Team Name *</label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Team Members</label>
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="flex space-x-4 items-end">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="email"
                      placeholder="Email"
                      value={member.email}
                      onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {formData.teamMembers.length < 4 && (
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                >
                  Add Team Member
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderHackathonDetails = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Hackathon Details</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Track/Theme *</label>
          <select
            name="track"
            value={formData.track}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Track</option>
            <option value="ai-ml">AI/ML</option>
            <option value="blockchain">Blockchain</option>
            <option value="cybersecurity">Cybersecurity</option>
            <option value="fintech">FinTech</option>
            <option value="healthcare">Healthcare</option>
            <option value="open-innovation">Open Innovation</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills/Technologies *</label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            rows={3}
            placeholder="List your relevant skills and technologies you're comfortable with"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Idea</label>
          <textarea
            name="projectIdea"
            value={formData.projectIdea}
            onChange={handleChange}
            rows={4}
            placeholder="Brief description of your project idea (if you have one)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">GitHub Profile</label>
            <input
              type="url"
              name="portfolioLinks.github"
              value={formData.portfolioLinks.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
            <input
              type="url"
              name="portfolioLinks.linkedin"
              value={formData.portfolioLinks.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Portfolio Website</label>
            <input
              type="url"
              name="portfolioLinks.portfolio"
              value={formData.portfolioLinks.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogistics = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Logistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">T-Shirt Size *</label>
          <select
            name="tshirtSize"
            value={formData.tshirtSize}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Requires Accommodation</label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="requiresAccommodation"
                checked={formData.requiresAccommodation}
                onChange={handleChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <span className="ml-2">Yes, I need accommodation</span>
            </label>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Dietary Preferences</label>
          <textarea
            name="dietaryPreferences"
            value={formData.dietaryPreferences}
            onChange={handleChange}
            rows={2}
            placeholder="Any dietary restrictions or preferences we should know about"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const renderLegalConsents = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Legal & Consents</h3>
      <div className="space-y-4">
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="codeOfConductConsent"
              checked={formData.codeOfConductConsent}
              onChange={handleChange}
              required
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2">I agree to follow the Code of Conduct *</span>
          </label>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="parentalConsent"
              checked={formData.parentalConsent}
              onChange={handleChange}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2">I have parental consent (if under 18)</span>
          </label>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="mediaReleaseConsent"
              checked={formData.mediaReleaseConsent}
              onChange={handleChange}
              required
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2">I agree to the media release terms *</span>
          </label>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="termsAndConditionsConsent"
              checked={formData.termsAndConditionsConsent}
              onChange={handleChange}
              required
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2">I agree to the terms and conditions *</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderOptionalQuestions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Optional Questions</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">How did you hear about us?</label>
          <select
            name="howDidYouHear"
            value={formData.howDidYouHear}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select an option</option>
            <option value="social-media">Social Media</option>
            <option value="friend">Friend/Colleague</option>
            <option value="university">University</option>
            <option value="email">Email</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">What do you hope to learn or achieve?</label>
          <textarea
            name="expectedLearning"
            value={formData.expectedLearning}
            onChange={handleChange}
            rows={3}
            placeholder="Share your expectations from this event"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderAcademicDetails();
      case 3:
        return renderTeamInformation();
      case 4:
        return renderHackathonDetails();
      case 5:
        return renderLogistics();
      case 6:
        return renderLegalConsents();
      case 7:
        return renderOptionalQuestions();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-6 flex items-center justify-center">
        <div className="text-indigo-600 text-xl">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-6 flex items-center justify-center">
        <div className="text-red-600 text-xl">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-black text-black relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_5%_40%,#ff69b4_2%,transparent_15%),radial-gradient(circle_at_80%_55%,#ff69b4_5%,transparent_35%),radial-gradient(circle_at_10%_90%,#00ff9f_5%,transparent_35%),radial-gradient(circle_at_90%_10%,#00ff9f_5%,transparent_20%)] before:opacity-20 before:pointer-events-none py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Event Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.name}</h2>
          <p className="text-gray-600 mb-2">{event.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
            <span>📍 {event.venue}</span>
            <span>👥 {event.maxParticipants} max participants</span>
          </div>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {renderCurrentStep()}

          <div className="mt-8 flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-600'
              }`}
            >
              Previous
            </button>

            {currentStep < 7 ? (
          <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
                Next
          </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md ${
                  submitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterEvent;