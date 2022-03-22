import { tapColors } from '../tapColors'

export const body = theme => ({
  $import: `@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500;700&display=swap')`,
  '*,html[class],head[class],footer[class],body[class],article[class],aside[class],textarea[class],input[class],select[class],span[class],div[class],p[class],i[class],b[class],h1[class],h2[class],h3[class],h4[class],h5[class],h6[class],nav[class],label[class],option[class]svg[class]path[class],details[class],main[class],mark[class],summary[class],time[class],section[class],figure[class],figcaption[class],code[class]': {
    fontFamily: tapColors.fontFamily,
  },
  body: {
    overflowY: 'auto',
    overflowX: 'hidden',
    flexDirection: 'column',
    backgroundColor: tapColors.appBackground,
  },
  // Override the RN-Web element to all setting a full height on child elements
  [`#root > div > div > div`]: {
    flex: 1,
  },
  // Custom Styles to hide the sidebar scrollbar
  // Different browsers require different style rules
  [`div.sidebar-container div.sidebar-scrolling-view`]: {
    overflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowY: 'scroll',
  },
  [`div.sidebar-container div.sidebar-scrolling-view::-webkit-scrollbar`]: {
    display: 'none',
  },
  [`.monaco-editor`]: {
    paddingTop: theme.padding.size
  },
  [`.tracker-text-running div.keg-indicator > div[role="progressbar"] > div`]: {
    top: -4,
    width: 14,
    height: 14,
    position: 'relative',
  }
})
