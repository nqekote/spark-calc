import { useState, useMemo } from 'react'
import InputField from '../../components/InputField'
import SegmentedControl from '../../components/SegmentedControl'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'

type ProtectionType = 'gfci' | 'afci'

interface Requirement {
  location: string
  description: string
  rule: string
  appliesTo: 'new' | 'renovation' | 'both'
  type: ProtectionType
}

const gfciRequirements: Requirement[] = [
  {
    location: 'Bathrooms',
    description: 'All receptacles within 1.5m of a sink.',
    rule: 'Rule 26-700(1)',
    appliesTo: 'both',
    type: 'gfci',
  },
  {
    location: 'Kitchens',
    description: 'All receptacles serving kitchen countertop.',
    rule: 'Rule 26-700(2)',
    appliesTo: 'both',
    type: 'gfci',
  },
  {
    location: 'Outdoors',
    description: 'All outdoor receptacles (residential).',
    rule: 'Rule 26-700(3)',
    appliesTo: 'both',
    type: 'gfci',
  },
  {
    location: 'Garages & Accessory Buildings',
    description: 'All receptacles.',
    rule: 'Rule 26-700(4)',
    appliesTo: 'both',
    type: 'gfci',
  },
  {
    location: 'Unfinished Basements',
    description: 'All receptacles.',
    rule: 'Rule 26-700(5)',
    appliesTo: 'both',
    type: 'gfci',
  },
  {
    location: 'Crawl Spaces',
    description: 'All receptacles at or below grade.',
    rule: 'Rule 26-700(6)',
    appliesTo: 'both',
    type: 'gfci',
  },
  {
    location: 'Within 1.5m of Sinks',
    description: 'All receptacles near laundry, utility, wet bar sinks.',
    rule: 'Rule 26-700(7)',
    appliesTo: 'both',
    type: 'gfci',
  },
  {
    location: 'Hot Tubs / Swimming Pools',
    description: 'All receptacles within 3m.',
    rule: 'Rule 68-064 / 68-302',
    appliesTo: 'both',
    type: 'gfci',
  },
  {
    location: 'Rooftops',
    description: 'All receptacles for HVAC equipment.',
    rule: 'Rule 26-700(8)',
    appliesTo: 'both',
    type: 'gfci',
  },
  {
    location: 'Construction Sites',
    description: 'All 15A and 20A receptacles.',
    rule: 'Rule 76-012',
    appliesTo: 'both',
    type: 'gfci',
  },
  {
    location: 'Boat Docks / Marinas',
    description: 'All receptacles.',
    rule: 'Rule 78-052',
    appliesTo: 'both',
    type: 'gfci',
  },
  {
    location: 'Carnivals / Fairs',
    description: 'Temporary installations.',
    rule: 'Rule 66-024',
    appliesTo: 'both',
    type: 'gfci',
  },
]

const afciRequirements: Requirement[] = [
  {
    location: 'Bedrooms',
    description: 'All bedroom circuits (120V, 15A/20A).',
    rule: 'Rule 26-722',
    appliesTo: 'new',
    type: 'afci',
  },
  {
    location: 'Living Rooms / Family Rooms',
    description: 'All 120V branch circuits.',
    rule: 'Rule 26-722',
    appliesTo: 'new',
    type: 'afci',
  },
  {
    location: 'Dining Rooms',
    description: 'All 120V branch circuits.',
    rule: 'Rule 26-722',
    appliesTo: 'new',
    type: 'afci',
  },
  {
    location: 'Hallways',
    description: 'All 120V branch circuits.',
    rule: 'Rule 26-722',
    appliesTo: 'new',
    type: 'afci',
  },
  {
    location: 'Closets',
    description: 'All 120V branch circuits.',
    rule: 'Rule 26-722',
    appliesTo: 'new',
    type: 'afci',
  },
  {
    location: 'Recreation Rooms',
    description: 'All 120V branch circuits.',
    rule: 'Rule 26-722',
    appliesTo: 'new',
    type: 'afci',
  },
  {
    location: 'Sunrooms',
    description: 'All 120V branch circuits.',
    rule: 'Rule 26-722',
    appliesTo: 'new',
    type: 'afci',
  },
  {
    location: 'Dens / Libraries / Studies',
    description: 'All 120V branch circuits.',
    rule: 'Rule 26-722',
    appliesTo: 'new',
    type: 'afci',
  },
]

const tabOptions = [
  { value: 'gfci', label: 'GFCI' },
  { value: 'afci', label: 'AFCI' },
]

const appliesToLabel: Record<string, string> = {
  new: 'New Construction',
  renovation: 'Renovations',
  both: 'New & Renovations',
}

function RequirementCard({ req }: { req: Requirement }) {
  const borderColor = req.type === 'gfci' ? '#d4a017' : '#3b82f6'

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--divider)',
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
      }}>
        <span style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text)',
        }}>
          {req.location}
        </span>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          color: borderColor,
          whiteSpace: 'nowrap',
          padding: '2px 8px',
          borderRadius: 4,
          background: req.type === 'gfci'
            ? 'rgba(212, 160, 23, 0.12)'
            : 'rgba(59, 130, 246, 0.12)',
        }}>
          {req.rule}
        </span>
      </div>
      <span style={{
        fontSize: 14,
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
      }}>
        {req.description}
      </span>
      <span style={{
        fontSize: 12,
        color: 'var(--text-secondary)',
        fontStyle: 'italic',
      }}>
        Applies to: {appliesToLabel[req.appliesTo]}
      </span>
    </div>
  )
}

export default function GfciAfciPage() {
  const [tab, setTab] = useState<ProtectionType>('gfci')
  const [search, setSearch] = useState('')

  const allRequirements = useMemo(() => ({
    gfci: gfciRequirements,
    afci: afciRequirements,
  }), [])

  const filteredRequirements = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return allRequirements[tab]
    // Search across both sets when there is a query, but filter to active tab
    return allRequirements[tab].filter(req =>
      req.location.toLowerCase().includes(query) ||
      req.description.toLowerCase().includes(query) ||
      req.rule.toLowerCase().includes(query)
    )
  }, [tab, search, allRequirements])

  // Also compute cross-tab matches for search indication
  const otherTab = tab === 'gfci' ? 'afci' : 'gfci'
  const otherTabCount = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return 0
    return allRequirements[otherTab].filter(req =>
      req.location.toLowerCase().includes(query) ||
      req.description.toLowerCase().includes(query) ||
      req.rule.toLowerCase().includes(query)
    ).length
  }, [search, otherTab, allRequirements])

  return (
    <>
      <Header title="GFCI & AFCI" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 100 }}>
        <InputField
          label="Search Requirements"
          value={search}
          onChange={setSearch}
          placeholder="e.g. bathroom, bedroom, pool..."
        />

        <SegmentedControl options={tabOptions} value={tab} onChange={v => setTab(v as ProtectionType)} />

        {search && otherTabCount > 0 && (
          <div
            onClick={() => setTab(otherTab as ProtectionType)}
            style={{
              fontSize: 13,
              color: 'var(--primary)',
              textAlign: 'center',
              cursor: 'pointer',
              padding: '6px 0',
            }}
          >
            {otherTabCount} result{otherTabCount > 1 ? 's' : ''} also found in {otherTab.toUpperCase()} tab
          </div>
        )}

        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-secondary)',
        }}>
          {tab === 'gfci' ? 'GFCI Protection Required \u2014 CEC Rule 26-700' : 'AFCI Protection Required \u2014 CEC Rule 26-722'}
          <span style={{ fontWeight: 400, marginLeft: 8 }}>
            ({filteredRequirements.length} location{filteredRequirements.length !== 1 ? 's' : ''})
          </span>
        </div>

        {filteredRequirements.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredRequirements.map((req, i) => (
              <RequirementCard key={i} req={req} />
            ))}
          </div>
        ) : (
          <div style={{
            padding: 32,
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 14,
          }}>
            No matching requirements found.
          </div>
        )}

        <InfoBox title="GFCI & AFCI Notes">
          <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>AFCI protection required for all 125V, 15A and 20A branch circuits in dwelling units.</li>
            <li>AFCI can be breaker-type (at panel) or outlet-type (at first outlet).</li>
            <li>GFCI and AFCI can be combined in a dual-function breaker.</li>
            <li>These requirements apply to new construction. Check with AHJ for renovation requirements.</li>
          </ul>
        </InfoBox>
      </div>
    </>
  )
}
