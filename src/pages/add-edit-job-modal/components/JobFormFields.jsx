import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const JobFormFields = ({ 
  formData, 
  onChange, 
  errors, 
  isEditing = false,
  onPreviewLink = () => {}
}) => {
  const statusOptions = [
    { value: 'wishlist', label: 'Wishlist' },
    { value: 'to apply', label: 'To Apply' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'decision', label: 'Decision' }
  ];

  const locationSuggestions = [
    "New York, NY",
    "San Francisco, CA", 
    "Los Angeles, CA",
    "Chicago, IL",
    "Boston, MA",
    "Seattle, WA",
    "Austin, TX",
    "Denver, CO",
    "Remote",
    "Hybrid"
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shouldShowFollowUpDate = () => {
    return ['applied', 'interview']?.includes(formData?.status);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job Title"
            type="text"
            placeholder="e.g. Senior Software Engineer"
            value={formData?.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e?.target?.value)}
            error={errors?.jobTitle}
            required
            className="col-span-1"
          />
          
          <Input
            label="Company"
            type="text"
            placeholder="e.g. Google Inc."
            value={formData?.company}
            onChange={(e) => handleInputChange('company', e?.target?.value)}
            error={errors?.company}
            required
            className="col-span-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Input
              label="Location"
              type="text"
              placeholder="e.g. San Francisco, CA or Remote"
              value={formData?.location}
              onChange={(e) => handleInputChange('location', e?.target?.value)}
              error={errors?.location}
              className="col-span-1"
            />
            {formData?.location && (
              <div className="absolute top-full left-0 right-0 z-10 bg-surface border border-border rounded-lg shadow-tier-2 mt-1 max-h-40 overflow-y-auto">
                {locationSuggestions?.filter(suggestion => 
                    suggestion?.toLowerCase()?.includes(formData?.location?.toLowerCase()) &&
                    suggestion?.toLowerCase() !== formData?.location?.toLowerCase()
                  )?.slice(0, 5)?.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleInputChange('location', suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-muted transition-colors duration-150"
                    >
                      {suggestion}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                label="Job Link"
                type="url"
                placeholder="https://company.com/careers/job-id"
                value={formData?.jobLink}
                onChange={(e) => handleInputChange('jobLink', e?.target?.value)}
                error={errors?.jobLink}
                className="col-span-1"
              />
            </div>
            {formData?.jobLink && isValidUrl(formData?.jobLink) && (
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  iconName="ExternalLink"
                  onClick={() => onPreviewLink(formData?.jobLink)}
                  className="mb-0"
                >
                  <span className="hidden sm:inline">Preview</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="text-sm font-medium text-text-primary mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconName="Calendar"
            iconPosition="left"
            onClick={() => {
              const today = new Date()?.toISOString()?.split('T')?.[0];
              handleInputChange('applicationDate', today);
            }}
          >
            Set Today
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconName="MapPin"
            iconPosition="left"
            onClick={() => handleInputChange('location', 'Remote')}
          >
            Remote
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconName="Target"
            iconPosition="left"
            onClick={() => handleInputChange('status', 'wishlist')}
          >
            Wishlist
          </Button>
        </div>
      </div>

      {/* Application Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
          Application Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Application Date"
            type="date"
            value={formData?.applicationDate}
            onChange={(e) => handleInputChange('applicationDate', e?.target?.value)}
            error={errors?.applicationDate}
            className="col-span-1"
          />
          
          <Select
            label="Status"
            options={statusOptions}
            value={formData?.status}
            onChange={(value) => handleInputChange('status', value)}
            error={errors?.status}
            placeholder="Select status"
            className="col-span-1"
          />
          
          {shouldShowFollowUpDate() && (
            <Input
              label="Follow-up Date"
              type="date"
              value={formData?.followUpDate}
              onChange={(e) => handleInputChange('followUpDate', e?.target?.value)}
              error={errors?.followUpDate}
              description="When to follow up on this application"
              className="col-span-1"
            />
          )}
        </div>
      </div>
      {/* Notes Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
          Additional Notes
        </h3>
        
        <div className="relative">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Notes
          </label>
          <textarea
            placeholder="Add any notes about this job application, interview details, or requirements..."
            value={formData?.notes}
            onChange={(e) => handleInputChange('notes', e?.target?.value)}
            rows={4}
            maxLength={1000}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-text-secondary">
              Optional field for additional context
            </span>
            <span className={`text-xs ${
              formData?.notes?.length > 900 
                ? 'text-warning' 
                : formData?.notes?.length > 950 
                ? 'text-error' :'text-text-secondary'
            }`}>
              {formData?.notes?.length}/1000
            </span>
          </div>
          {errors?.notes && (
            <p className="text-sm text-error mt-1">{errors?.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobFormFields;