

import '../AddForm.css';
import Card from '../components/Card';
import CardForm from '../components/CardForm';
<Card>
    <CardForm onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <Card.Section title={t('addOpportunity.basicInfo', 'Basic Information')}>
            <Card.Input
                label={t('addOpportunity.roleLabel', 'Role Title')}
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder={t('addOpportunity.rolePlaceholder', 'e.g., Community Event Coordinator')}
                required
            />
            <Card.Input
                label={t('addOpportunity.skillsLabel', 'Required Skills')}
                name="requiredSkills"
                value={form.requiredSkills}
                onChange={handleChange}
                placeholder={t('addOpportunity.skillsPlaceholder', 'e.g., Communication, Organization, Leadership')}
                required
            />
        </Card.Section>

        {/* Time & Contact Section */}
        <Card.Section title={t('addOpportunity.timeContact', 'Time & Contact')}>
            <Card.Input
                label={t('addOpportunity.timeCommitmentLabel', 'Time Commitment')}
                name="timeCommitment"
                value={form.timeCommitment}
                onChange={handleChange}
                placeholder={t('addOpportunity.timeCommitmentPlaceholder', 'e.g., 2-3 hours per week')}
                required
            />
            <Card.Input
                label={t('addOpportunity.contactLabel', 'Contact Information')}
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder={t('addOpportunity.contactPlaceholder', 'Email or phone number')}
                required
            />
        </Card.Section>

        {/* Location & Priority Section */}
        <Card.Section title={t('addOpportunity.locationPriority', 'Location & Priority')}>
            <Card.Input
                label={t('addOpportunity.locationLabel', 'Primary Location')}
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder={t('addOpportunity.locationPlaceholder', 'Main venue or area')}
            />
            <Card.Input
                label={t('addOpportunity.placeLabel', 'Additional Place Info')}
                name="place"
                value={form.place}
                onChange={handleChange}
                placeholder={t('addOpportunity.placePlaceholder', 'Building, room, or specific area')}
            />
            <Card.Select
                label={t('addOpportunity.urgencyLabel', 'Priority Level')}
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                options={[
                    { value: 'high', label: t('addOpportunity.urgencyHigh', '🔴 Urgent') },
                    { value: 'medium', label: t('addOpportunity.urgencyMedium', '🟡 Medium') },
                    { value: 'ongoing', label: t('addOpportunity.urgencyOngoing', '🟢 Ongoing') },
                ]}
            />
        </Card.Section>

        {/* Schedule Section */}
        <Card.Section title={t('addOpportunity.schedule', 'Schedule (Optional)')}>
            <Card.Input
                label={t('addOpportunity.startDateLabel', 'Start Date')}
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
            />
            <Card.Input
                label={t('addOpportunity.endDateLabel', 'End Date')}
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
            />
        </Card.Section>

        {/* Description Section */}
        <Card.Section title={t('addOpportunity.details', 'Opportunity Details')}>
            <Card.TextArea
                label={t('addOpportunity.descriptionLabel', 'Description')}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder={t('addOpportunity.descriptionPlaceholder', 'Describe the volunteer opportunity, what volunteers will do, and why it matters...')}
                rows={4}
                required
            />
        </Card.Section>

        {/* Action Buttons */}
        <Card.Actions>
            <Card.Button
                type="button"
                onClick={() => setForm({ role: '', description: '', requiredSkills: '', timeCommitment: '', contact: '', urgency: 'ongoing', location: '', place: '', startDate: '', endDate: '' })}
            >
                {t('addOpportunity.cancelButton', 'Cancel')}
            </Card.Button>
            <Card.Button type="submit" disabled={adding}>
                {adding ? t('addOpportunity.loading', 'Creating...') : t('addOpportunity.submitButton', 'Create Opportunity')}
            </Card.Button>
        </Card.Actions>
    </CardForm>
</Card>;


export default AddOpportunity;
