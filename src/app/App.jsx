import React, { useMemo, useState } from 'react';
import { ResponsiveShell } from '../components/layout/ResponsiveShell.jsx';
import { memberTabs, profileTabs, profiles } from './profiles.js';
import { MemberHome } from '../flows/member/MemberHome.jsx';
import { MemberActivities } from '../flows/member/MemberActivities.jsx';
import { MemberNursery } from '../flows/member/MemberNursery.jsx';
import { MemberImpact } from '../flows/member/MemberImpact.jsx';
import { MemberAccount } from '../flows/member/MemberAccount.jsx';
import { InstitutionFlow } from '../flows/institution/InstitutionFlow.jsx';
import { InstitutionPublicPage } from '../flows/public/InstitutionPublicPage.jsx';
import { ProducerFlow } from '../flows/producer/ProducerFlow.jsx';
import { ValidatorFlow } from '../flows/validator/ValidatorFlow.jsx';

const flows = {
  member: { home: MemberHome, activities: MemberActivities, nursery: MemberNursery, impact: MemberImpact, account: MemberAccount },
  institution: { home: InstitutionFlow, trees: InstitutionFlow, leafs: InstitutionFlow, activities: InstitutionFlow, page: InstitutionFlow, share: InstitutionFlow },
  producer: { home: ProducerFlow, lots: ProducerFlow, evidence: ProducerFlow, history: ProducerFlow, account: ProducerFlow },
  validator: { home: ValidatorFlow, review: ValidatorFlow, records: ValidatorFlow, history: ValidatorFlow, account: ValidatorFlow },
};

function getPublicInstitutionSlug() {
  const match = window.location.pathname.match(/^\/i\/([a-z0-9-]+)/i);
  return match?.[1] || null;
}

function App() {
  const publicSlug = getPublicInstitutionSlug();
  const [profileId, setProfileId] = useState('member');
  const [tabId, setTabId] = useState('home');

  if (publicSlug) return <InstitutionPublicPage slug={publicSlug} />;

  const activeProfile = profiles.find((profile) => profile.id === profileId) || profiles[0];
  const tabs = profileId === 'member' ? memberTabs : profileTabs[profileId];
  const ActiveScreen = useMemo(() => flows[profileId]?.[tabId] || flows[profileId]?.home || MemberHome, [profileId, tabId]);

  function handleProfileChange(nextProfileId) {
    setProfileId(nextProfileId);
    setTabId('home');
  }

  return (
    <ResponsiveShell profiles={profiles} activeProfile={activeProfile} onProfileChange={handleProfileChange} tabs={tabs} activeTab={tabId} onTabChange={setTabId}>
      <ActiveScreen profile={activeProfile} tab={tabId} onTabChange={setTabId} />
    </ResponsiveShell>
  );
}

export default App;
