function MenuIcon() {
  return (
    <span className="topbar__menu-icon" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

function SearchIcon() {
  return <span className="topbar__search-icon" aria-hidden="true" />
}

function NotificationIcon() {
  return (
    <span className="topbar__notification-icon" aria-hidden="true">
      <span className="topbar__notification-dot" />
    </span>
  )
}

function Topbar({ onOpenSidebar }) {
  return (
    <header className="topbar">
      <button
        className="topbar__menu-button"
        type="button"
        aria-label="Open navigation"
        onClick={onOpenSidebar}
      >
        <MenuIcon />
      </button>

      <label className="topbar__search">
        <SearchIcon />
        <span className="sr-only">Search clients, deals, or tasks</span>
        <input type="search" placeholder="Search clients, deals, or tasks" />
      </label>

      <div className="topbar__actions">
        <button className="topbar__icon-button" type="button" aria-label="View notifications">
          <NotificationIcon />
        </button>
        <button className="topbar__profile" type="button" aria-label="Open user menu">
          <span className="topbar__profile-avatar">JD</span>
          <span className="topbar__profile-name">Jordan Davis</span>
          <span className="topbar__profile-chevron" aria-hidden="true">
            &#8964;
          </span>
        </button>
      </div>
    </header>
  )
}

export default Topbar
