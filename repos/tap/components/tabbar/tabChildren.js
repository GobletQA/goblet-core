import React, { useMemo } from 'react'
import { Tab } from './tab'
import { mapColl } from '@keg-hub/jsutils'
import { useStyle } from '@keg-hub/re-theme'
import { TabbarPortal } from './tabbarPortal'
import { TabbarContainer, TabViewMain } from './tabbar.restyle'
import { isValidComponent, renderFromType } from '@keg-hub/keg-components'

/**
 * Renders the TabBar Tabs from the passed in tabs array prop
 * @param {Object} props
 */
const Tabs = React.memo(({ activeId, tabs, styles, onTabSelect }) => {
  return mapColl(tabs, (index, tab) => {
    const {
      Tab: Component,
      tab: component,
      id,
      key,
      title,
      disableTab,
      ...tabProps
    } = tab

    const keyId = key || id || index
    return !Component && !component && !title ? null : (
      <Tab
        id={id}
        key={keyId}
        disabled={disableTab}
        className='tabbar-tab'
        {...tabProps}
        title={title}
        styles={styles}
        onTabSelect={onTabSelect}
        active={activeId === id}
      >
        {renderFromType(Component || component)}
      </Tab>
    )
  })
})

/**
 * Active View component of the currently Active Tab
 * @param {Object} props
 */
const ActiveTabView = React.memo(({ tab, styles }) => {
  const ViewComponent = tab && (tab.View || tab.view)
  return isValidComponent(ViewComponent) ? (
    <ViewComponent {...tab} styles={styles} />
  ) : null
})

/**
 * Renders the Bar that wraps the passed in Tabs
 * @param {Object} props
 */
const BarComponent = React.memo(props => {
  const { fixed, tabs, location, activeId, styles, onSelectTab } = props

  // TODO: move to tabbar.restyle for tabbar container
  const containerStyles = useStyle(
    fixed && { ...styles?.fixed?.main, ...styles?.fixed[location] },
    styles?.bar?.main,
    styles?.bar[location]
  )

  return (
    <TabbarContainer className='tabbar-bar' style={containerStyles}>
      <Tabs
        tabs={tabs}
        activeId={activeId}
        styles={styles.tab}
        onTabSelect={onSelectTab}
      />
    </TabbarContainer>
  )
})

/**
 * Component children of the TabBar Component
 * Renders the Tabs in a bar based on location and the Active Tabs view
 * @param {Object} props
 *
 */
export const TabChildren = props => {
  const {
    tabs,
    fixed,
    styles,
    activeId,
    location,
    CurrentTab,
    onSelectTab,
  } = props

  const TabView = useMemo(
    () =>
      CurrentTab && (CurrentTab.View || CurrentTab.view) ? (
        <TabViewMain
          className='tabview-main'
          style={styles.tabview}
          key='tabbar-tabview-component'
        >
          <ActiveTabView tab={CurrentTab} styles={styles} />
        </TabViewMain>
      ) : null,
    [styles, CurrentTab]
  )

  const Bar = (
    <BarComponent
      tabs={tabs}
      fixed={fixed}
      activeId={activeId}
      location={location}
      styles={styles}
      onSelectTab={onSelectTab}
      key={'tabbar-bar-component'}
    />
  )

  return location === 'bottom' ? (
    <TabbarPortal>
      {TabView}
      {Bar}
    </TabbarPortal>
  ) : (
    [Bar, TabView]
  )
}
