const navigationItems = [
  'Overview',
  'Clients',
  'Deals',
  'Tasks',
  'Invoices',
  'Reports',
]

const secondaryItems = ['Settings', 'Help center']

function NavigationLink({ label, active = false }) {
  return (
    <a
      className={`sidebar-link${active ? ' sidebar-link--active' : ''}`}
      href={`#${label.toLowerCase().replace(' ', '-')}`}
    >
      <span className="sidebar-link__marker" aria-hidden="true" />
      <span>{label}</span>
    </a>
  )
}

function Sidebar({ open = false, onClose }) {
  return (
    <>
      <button
        className={`sidebar-overlay${open ? ' sidebar-overlay--visible' : ''}`}
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
      />
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <span className="sidebar__brand-mark">C</span>
          <div>
            <p className="sidebar__brand-name">ClientFlow</p>
            <p className="sidebar__brand-type">CRM workspace</p>
          </div>
          <button
            className="sidebar__close"
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <button className="workspace-switcher" type="button">
          <span className="workspace-switcher__avatar">A</span>
          <span className="workspace-switcher__details">
            <span>Acme Studio</span>
            <span>Business plan</span>
          </span>
          <span className="workspace-switcher__chevron" aria-hidden="true">
            &#8964;
          </span>
        </button>

        <nav className="sidebar__nav" aria-label="Main navigation">
          <p className="sidebar__section-label">Workspace</p>
          {navigationItems.map((item) => (
            <NavigationLink key={item} label={item} active={item === 'Overview'} />
          ))}
        </nav>

        <nav className="sidebar__nav sidebar__nav--secondary" aria-label="Support">
          {secondaryItems.map((item) => (
            <NavigationLink key={item} label={item} />
          ))}
        </nav>

        <div className="sidebar__profile">
          <span className="sidebar__profile-avatar">JD</span>
          <div className="sidebar__profile-details">
            <p>Jordan Davis</p>
            <span>Workspace admin</span>
          </div>
          <button className="sidebar__profile-menu" type="button" aria-label="Open profile menu">
            ...
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
