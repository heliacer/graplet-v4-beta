import { ContinuousCategory, ContinuousFlyout, ContinuousMetrics, ContinuousToolbox, RecyclableBlockFlyoutInflater } from "@blockly/continuous-toolbox"
import { BlocklyOptions, browserEvents, bumpObjects, common, Css, DropDownDiv, Grid, Options, registry, ScrollbarPair, ToolboxCategory, Tooltip, Touch, utils, WidgetDiv, WorkspaceSvg } from "blockly"

export function initializeWorkspace(
  container: HTMLDivElement,
  blocklyOptions: BlocklyOptions,
): WorkspaceSvg {

  registerContinuousToolbox()
  const options = new Options(blocklyOptions)
  const subContainer = createSubContainer(container, options.RTL)
  const svg = createDom(subContainer, options)
  const workspace = createMainWorkspace(subContainer, svg, options)

  init(workspace)
  setupWorkspace(workspace, subContainer)

  return workspace
}

let toolboxRegistered = false

function registerContinuousToolbox() {
  if (toolboxRegistered) return

  registry.register(
    registry.Type.TOOLBOX_ITEM,
    ToolboxCategory.registrationName,
    ContinuousCategory,
    true,
  )

  registry.register(
    registry.Type.METRICS_MANAGER,
    'ContinuousMetrics',
    ContinuousMetrics,
    true,
  )

  registry.register(
    registry.Type.FLYOUTS_VERTICAL_TOOLBOX,
    'ContinuousFlyout',
    ContinuousFlyout,
    true,
  )

  registry.register(
    registry.Type.TOOLBOX,
    'ContinuousToolbox',
    ContinuousToolbox,
    true,
  )

  registry.register(
    registry.Type.FLYOUT_INFLATER,
    'block',
    RecyclableBlockFlyoutInflater,
    true,
  )

  toolboxRegistered = true
}

function createSubContainer(container: HTMLDivElement, isRTL?: boolean): HTMLDivElement {
  const subContainer = document.createElement('div')
  utils.dom.addClass(subContainer, 'injectionDiv')
  if (isRTL) {
    utils.dom.addClass(subContainer, 'blocklyRTL')
  }
  container.appendChild(subContainer)
  return subContainer
}

function createDom(container: HTMLElement, options: Options): SVGElement {
  container.setAttribute('dir', 'LTR')
  Css.inject(options.hasCss, options.pathToMedia)

  const svg = utils.dom.createSvgElement(utils.Svg.SVG, {
    'xmlns': utils.dom.SVG_NS,
    'xmlns:html': utils.dom.HTML_NS,
    'xmlns:xlink': utils.dom.XLINK_NS,
    'version': '1.1',
    'class': 'blocklySvg',
  }, container)

  const defs = utils.dom.createSvgElement(utils.Svg.DEFS, {}, svg)
  options.gridPattern = Grid.createDom(
    String(Math.random()).substring(2),
    options.gridOptions,
    defs,
    container,
  )
  return svg
}

function createMainWorkspace(
  injectionDiv: HTMLElement,
  svg: SVGElement,
  options: Options,
): WorkspaceSvg {
  options.parentWorkspace = null
  const workspace = new WorkspaceSvg(options)
  const wsOptions = workspace.options

  workspace.scale = wsOptions.zoomOptions.startScale
  svg.appendChild(workspace.createDom('blocklyMainBackground', injectionDiv))

  // Add CSS classes
  const rendererClass = workspace.getRenderer().getClassName()
  const themeClass = workspace.getTheme().getClassName()
  if (rendererClass) utils.dom.addClass(injectionDiv, rendererClass)
  if (themeClass) utils.dom.addClass(injectionDiv, themeClass)

  // Setup components
  setupWorkspaceComponents(workspace, svg, wsOptions)

  workspace.translate(0, 0)
  workspace.addChangeListener(bumpObjects.bumpIntoBoundsHandler(workspace))

  // Create shared DOM elements once
  WidgetDiv.createDom()
  DropDownDiv.createDom()
  Tooltip.createDom()

  return workspace
}

function setupWorkspaceComponents(workspace: WorkspaceSvg, svg: SVGElement, options: Options) {
  if (!options.hasCategories && options.languageTree) {
    const flyout = workspace.addFlyout(utils.Svg.SVG)
    utils.dom.insertAfter(flyout, svg)
  }
  if (options.hasTrashcan) workspace.addTrashcan()
  if (options.zoomOptions?.controls) workspace.addZoomControls()

  workspace.getThemeManager().subscribe(svg, 'workspaceBackgroundColour', 'background-color')
}

function setupWorkspace(workspace: WorkspaceSvg, subContainer: HTMLElement) {
  common.setMainWorkspace(workspace)
  common.svgResize(workspace)

  subContainer.addEventListener('focusin', () => common.setMainWorkspace(workspace))
  browserEvents.conditionalBind(subContainer, 'keydown', null, common.globalShortcutHandler)
}

function init(workspace: WorkspaceSvg) {
  const options = workspace.options
  const svg = workspace.getParentSvg()

  // Context menu suppression
  browserEvents.conditionalBind(svg.parentNode as Element, 'contextmenu', null, (e: Event) => {
    if (!browserEvents.isTargetInput(e)) e.preventDefault()
  })

  // Window resize handler
  const resizeHandler = browserEvents.conditionalBind(window, 'resize', null, () => resize(workspace))
  workspace.setResizeHandlerWrapper(resizeHandler)

  bindDocumentEvents()
  initializeComponents(workspace, options)
}

function initializeComponents(workspace: WorkspaceSvg, options: Options) {
  // Toolbox/Flyout initialization
  if (options.languageTree) {
    const toolbox = workspace.getToolbox()
    const flyout = workspace.getFlyout(true)

    if (toolbox) {
      toolbox.init()
    } else if (flyout) {
      flyout.init(workspace)
      flyout.show(options.languageTree)
      flyout.scrollToStart?.()
    }
  }

  // Component initialization
  if (options.hasTrashcan) workspace.trashcan!.init()
  if (options.zoomOptions?.controls) workspace.zoomControls_!.init()

  // Scrollbars
  if (options.moveOptions?.scrollbars) {
    const scrollbars = options.moveOptions.scrollbars
    const horizontal = scrollbars === true || !!scrollbars.horizontal
    const vertical = scrollbars === true || !!scrollbars.vertical

    workspace.scrollbar = new ScrollbarPair(workspace, horizontal, vertical, 'blocklyMainWorkspaceScrollbar')
    workspace.scrollbar.resize()
  } else {
    workspace.setMetrics({ x: 0.5, y: 0.5 })
  }

  // Load sounds if enabled
  if (options.hasSounds) loadSounds(options.pathToMedia, workspace)
}

let documentEventsBound = false

function bindDocumentEvents() {
  if (documentEventsBound) return

  browserEvents.conditionalBind(document, 'scroll', null, () => {
    common.getAllWorkspaces().forEach(ws => {
      if (ws instanceof WorkspaceSvg) ws.updateInverseScreenCTM()
    })
  })

  browserEvents.bind(document, 'touchend', null, Touch.longStop)
  browserEvents.bind(document, 'touchcancel', null, Touch.longStop)
  documentEventsBound = true
}

function loadSounds(pathToMedia: string, workspace: WorkspaceSvg) {
  const audioMgr = workspace.getAudioManager()
  const sounds = [
    { files: ['click.mp3', 'click.wav', 'click.ogg'], name: 'click' },
    { files: ['disconnect.wav', 'disconnect.mp3', 'disconnect.ogg'], name: 'disconnect' },
    { files: ['delete.mp3', 'delete.ogg', 'delete.wav'], name: 'delete' }
  ]

  sounds.forEach(({ files, name }) => {
    audioMgr.load(files.map(file => pathToMedia + file), name)
  })

  const soundBinds: browserEvents.Data[] = []
  const unbindSounds = () => {
    soundBinds.splice(0).forEach(binding => browserEvents.unbind(binding))
    audioMgr.preload()
  }

  soundBinds.push(
    browserEvents.conditionalBind(document, 'pointermove', null, unbindSounds, true),
    browserEvents.conditionalBind(document, 'touchstart', null, unbindSounds, true)
  )
}

export function resize(workspace: WorkspaceSvg) {
  Tooltip.hide()
  workspace.hideComponents(true)
  DropDownDiv.repositionForWindowResize()
  WidgetDiv.repositionForWindowResize()
  common.svgResize(workspace)
  bumpObjects.bumpTopObjectsIntoBounds(workspace)
}