import { useEffect, useRef } from 'react'

export function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let W = 0
    let H = 0
    let time = 0
    let isMobile = false

    // ── Color palette ──
    const ORANGE = { r: 255, g: 126, b: 95 }
    const GOLD = { r: 255, g: 179, b: 71 }
    const CYAN = { r: 0, g: 220, b: 255 }
    const PURPLE = { r: 168, g: 85, b: 247 }

    // ── Particles ──
    interface Particle {
      x: number; y: number
      vx: number; vy: number
      size: number
      color: typeof ORANGE
      life: number; maxLife: number
      opacity: number
    }

    // ── Grid nodes (futuristic property network) ──
    interface GridNode {
      x: number; y: number
      baseX: number; baseY: number
      size: number
      pulse: number
      speed: number
      type: 'property' | 'data' | 'hub'
      label: string
      color: typeof ORANGE
    }

    // ── Holographic buildings ──
    interface HoloBuilding {
      x: number; y: number
      width: number; height: number
      targetHeight: number
      floors: number
      color: typeof ORANGE
      phase: number
      speed: number
      glitchOffset: number
    }

    // ── Data streams ──
    interface DataStream {
      x: number; y: number
      speed: number
      chars: string[]
      opacity: number
      length: number
      color: typeof ORANGE
    }

    // ── Floating text fragments ──
    interface FloatingText {
      x: number; y: number
      vx: number; vy: number
      text: string
      fontSize: number
      opacity: number
      maxOpacity: number
      phase: number
      color: typeof ORANGE
    }

    // ── Hexagonal grid cells ──
    interface HexCell {
      cx: number; cy: number
      radius: number
      phase: number
      active: boolean
      pulseSpeed: number
    }

    let particles: Particle[] = []
    let gridNodes: GridNode[] = []
    let holoBuildings: HoloBuilding[] = []
    let dataStreams: DataStream[] = []
    let floatingTexts: FloatingText[] = []
    let hexCells: HexCell[] = []

    // ── FTC text properties ──
    const FTC_TEXT = 'FLIP THE CONTRACT'

    const RE_TERMS = [
      'WHOLESALE', 'ASSIGNMENT', 'ARV', 'COMPS', 'CLOSING',
      'ESCROW', 'TITLE', 'EQUITY', 'ROI', 'CASH FLOW',
      'DUE DILIGENCE', 'UNDER CONTRACT', 'DOUBLE CLOSE',
      'EMD', 'LOI', 'NET PROFIT', 'DEAL FLOW', 'DISTRESSED',
      'OFF-MARKET', 'FLIP', 'MOTIVATED SELLER', 'BUYER LIST',
      'SKIP TRACE', 'JV', 'HEDGE FUND', 'RENTAL', 'MLS',
      '$$$', '>>> PROFIT <<<', 'LOCKED IN', 'ASSIGNED',
    ]

    function spawnParticles() {
      particles = []
      let count = Math.floor((W * H) / 8000)
      if (isMobile) count = Math.min(count, 3)
      for (let i = 0; i < count; i++) {
        particles.push(createParticle())
      }
    }

    function createParticle(): Particle {
      const colors = [ORANGE, GOLD, CYAN, PURPLE]
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        size: 0.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 300 + Math.random() * 600,
        opacity: Math.random() * 0.6,
      }
    }

    function spawnGridNodes() {
      gridNodes = []
      const spacing = isMobile ? 270 : 180
      const labels = ['PROPERTY', 'DEAL', 'BUYER', 'SELLER', 'CLOSING', 'EQUITY', 'ASSIGNED', 'FUNDED']
      const types: GridNode['type'][] = ['property', 'data', 'hub']
      const colors = [ORANGE, GOLD, CYAN, PURPLE]
      const cols = Math.ceil(W / spacing) + 2
      const rows = Math.ceil(H / spacing) + 2

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const x = c * spacing + (r % 2 === 0 ? 0 : spacing / 2) + (Math.random() - 0.5) * 40
          const y = r * spacing + (Math.random() - 0.5) * 40
          gridNodes.push({
            x, y, baseX: x, baseY: y,
            size: 2 + Math.random() * 3,
            pulse: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.02,
            type: types[Math.floor(Math.random() * types.length)],
            label: labels[Math.floor(Math.random() * labels.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
          })
        }
      }
    }

    function spawnHoloBuildings() {
      holoBuildings = []
      let count = Math.floor(W / 120) + 3
      if (isMobile) count = Math.floor(count * 0.5)
      const colors = [ORANGE, CYAN, PURPLE, GOLD]
      for (let i = 0; i < count; i++) {
        const bw = 30 + Math.random() * 60
        holoBuildings.push({
          x: (i / count) * W + (Math.random() - 0.5) * 80,
          y: H * 0.6 + Math.random() * H * 0.25,
          width: bw,
          height: 0,
          targetHeight: 60 + Math.random() * 200,
          floors: 3 + Math.floor(Math.random() * 15),
          color: colors[Math.floor(Math.random() * colors.length)],
          phase: Math.random() * Math.PI * 2,
          speed: 0.005 + Math.random() * 0.015,
          glitchOffset: 0,
        })
      }
    }

    function spawnDataStreams() {
      dataStreams = []
      let count = Math.floor(W / 60) + 5
      if (isMobile) count = Math.min(count, 2)
      const colors = [ORANGE, CYAN, PURPLE]
      for (let i = 0; i < count; i++) {
        const chars: string[] = []
        const len = 8 + Math.floor(Math.random() * 20)
        for (let j = 0; j < len; j++) {
          chars.push(RE_TERMS[Math.floor(Math.random() * RE_TERMS.length)].charAt(Math.floor(Math.random() * 8)))
        }
        dataStreams.push({
          x: Math.random() * W,
          y: Math.random() * H - H,
          speed: 0.5 + Math.random() * 2,
          chars,
          opacity: 0.05 + Math.random() * 0.15,
          length: len,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    function spawnFloatingTexts() {
      floatingTexts = []
      let count = Math.floor((W * H) / 80000) + 4
      if (isMobile) count = Math.min(count, 3)
      const colors = [ORANGE, GOLD, CYAN, PURPLE]
      for (let i = 0; i < count; i++) {
        floatingTexts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2 - 0.15,
          text: RE_TERMS[Math.floor(Math.random() * RE_TERMS.length)],
          fontSize: 9 + Math.random() * 5,
          opacity: 0,
          maxOpacity: 0.08 + Math.random() * 0.12,
          phase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    function spawnHexGrid() {
      hexCells = []
      const hexR = isMobile ? 60 : 40
      const hexH = hexR * Math.sqrt(3)
      const cols = Math.ceil(W / (hexR * 1.5)) + 2
      const rows = Math.ceil(H / hexH) + 2

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const cx = c * hexR * 1.5
          const cy = r * hexH + (c % 2 === 0 ? 0 : hexH / 2)
          hexCells.push({
            cx, cy, radius: hexR,
            phase: Math.random() * Math.PI * 2,
            active: Math.random() < 0.15,
            pulseSpeed: 0.005 + Math.random() * 0.015,
          })
        }
      }
    }

    function resize() {
      W = canvas!.width = window.innerWidth
      H = canvas!.height = window.innerHeight
      isMobile = W < 768
      spawnParticles()
      spawnGridNodes()
      spawnHoloBuildings()
      spawnDataStreams()
      spawnFloatingTexts()
      spawnHexGrid()
    }

    // ── Drawing ──

    function drawBackground() {
      // Deep dark gradient base
      const grad = ctx!.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, W * 0.8)
      grad.addColorStop(0, '#1a2030')
      grad.addColorStop(0.4, '#141a26')
      grad.addColorStop(0.7, '#10161f')
      grad.addColorStop(1, '#0c1018')
      ctx!.fillStyle = grad
      ctx!.fillRect(0, 0, W, H)

      // Subtle color nebula effect
      const nebula1 = ctx!.createRadialGradient(W * 0.2, H * 0.3, 0, W * 0.2, H * 0.3, W * 0.35)
      nebula1.addColorStop(0, `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},0.06)`)
      nebula1.addColorStop(1, 'rgba(0,0,0,0)')
      ctx!.fillStyle = nebula1
      ctx!.fillRect(0, 0, W, H)

      const nebula2 = ctx!.createRadialGradient(W * 0.8, H * 0.6, 0, W * 0.8, H * 0.6, W * 0.3)
      nebula2.addColorStop(0, `rgba(${CYAN.r},${CYAN.g},${CYAN.b},0.045)`)
      nebula2.addColorStop(1, 'rgba(0,0,0,0)')
      ctx!.fillStyle = nebula2
      ctx!.fillRect(0, 0, W, H)

      const nebula3 = ctx!.createRadialGradient(W * 0.5, H * 0.8, 0, W * 0.5, H * 0.8, W * 0.25)
      nebula3.addColorStop(0, `rgba(${PURPLE.r},${PURPLE.g},${PURPLE.b},0.04)`)
      nebula3.addColorStop(1, 'rgba(0,0,0,0)')
      ctx!.fillStyle = nebula3
      ctx!.fillRect(0, 0, W, H)
    }

    function drawHexGrid() {
      for (const hex of hexCells) {
        hex.phase += hex.pulseSpeed
        const pulse = Math.sin(hex.phase) * 0.5 + 0.5
        const alpha = hex.active ? 0.07 + pulse * 0.08 : 0.02 + pulse * 0.012

        ctx!.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6
          const hx = hex.cx + hex.radius * Math.cos(angle)
          const hy = hex.cy + hex.radius * Math.sin(angle)
          if (i === 0) ctx!.moveTo(hx, hy)
          else ctx!.lineTo(hx, hy)
        }
        ctx!.closePath()

        if (hex.active) {
          ctx!.fillStyle = `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},${alpha * 0.3})`
          ctx!.fill()
        }

        ctx!.strokeStyle = `rgba(${CYAN.r},${CYAN.g},${CYAN.b},${alpha})`
        ctx!.lineWidth = 0.5
        ctx!.stroke()
      }
    }

    function drawGridNetwork() {
      // Draw connections between nearby nodes
      for (let i = 0; i < gridNodes.length; i++) {
        const a = gridNodes[i]
        a.pulse += a.speed
        a.x = a.baseX + Math.sin(a.pulse) * 8
        a.y = a.baseY + Math.cos(a.pulse * 0.7) * 6

        for (let j = i + 1; j < gridNodes.length; j++) {
          const b = gridNodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.06
            const c = a.color
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()

            // Animated data pulse along connection
            if (Math.random() < 0.001) {
              const t = (time * 0.01) % 1
              const px = a.x + (b.x - a.x) * t
              const py = a.y + (b.y - a.y) * t
              ctx!.beginPath()
              ctx!.arc(px, py, 1.5, 0, Math.PI * 2)
              ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha * 3})`
              ctx!.fill()
            }
          }
        }

        // Draw node
        const c = a.color
        const nodePulse = Math.sin(a.pulse) * 0.5 + 0.5
        const nodeAlpha = 0.15 + nodePulse * 0.2

        // Glow
        const glow = ctx!.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.size * 6)
        glow.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${nodeAlpha * 0.15})`)
        glow.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`)
        ctx!.fillStyle = glow
        ctx!.beginPath()
        ctx!.arc(a.x, a.y, a.size * 6, 0, Math.PI * 2)
        ctx!.fill()

        // Core dot
        ctx!.beginPath()
        ctx!.arc(a.x, a.y, a.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${nodeAlpha})`
        ctx!.fill()

        // Hub nodes get a ring
        if (a.type === 'hub') {
          ctx!.beginPath()
          ctx!.arc(a.x, a.y, a.size * 3, 0, Math.PI * 2)
          ctx!.strokeStyle = `rgba(${c.r},${c.g},${c.b},${nodeAlpha * 0.3})`
          ctx!.lineWidth = 0.5
          ctx!.stroke()
        }
      }
    }

    function drawHoloBuildings() {
      for (const b of holoBuildings) {
        b.phase += b.speed
        // Animate height up
        if (b.height < b.targetHeight) {
          b.height += (b.targetHeight - b.height) * 0.01
        }

        // Occasional glitch
        b.glitchOffset = Math.random() < 0.005 ? (Math.random() - 0.5) * 8 : b.glitchOffset * 0.9

        const c = b.color
        const pulse = Math.sin(b.phase) * 0.5 + 0.5
        const baseAlpha = 0.06 + pulse * 0.04
        const bx = b.x + b.glitchOffset
        const by = b.y

        // Building wireframe
        ctx!.strokeStyle = `rgba(${c.r},${c.g},${c.b},${baseAlpha})`
        ctx!.lineWidth = 0.8

        // Front face
        ctx!.beginPath()
        ctx!.moveTo(bx, by)
        ctx!.lineTo(bx, by - b.height)
        ctx!.lineTo(bx + b.width, by - b.height)
        ctx!.lineTo(bx + b.width, by)
        ctx!.closePath()
        ctx!.stroke()

        // 3D side face (isometric-ish)
        const depthX = b.width * 0.3
        const depthY = b.width * 0.2
        ctx!.beginPath()
        ctx!.moveTo(bx + b.width, by)
        ctx!.lineTo(bx + b.width + depthX, by - depthY)
        ctx!.lineTo(bx + b.width + depthX, by - b.height - depthY)
        ctx!.lineTo(bx + b.width, by - b.height)
        ctx!.stroke()

        // Top face
        ctx!.beginPath()
        ctx!.moveTo(bx, by - b.height)
        ctx!.lineTo(bx + depthX, by - b.height - depthY)
        ctx!.lineTo(bx + b.width + depthX, by - b.height - depthY)
        ctx!.lineTo(bx + b.width, by - b.height)
        ctx!.stroke()

        // Floor lines
        const floorH = b.height / b.floors
        for (let f = 1; f < b.floors; f++) {
          const fy = by - floorH * f
          ctx!.globalAlpha = baseAlpha * 0.5
          ctx!.beginPath()
          ctx!.moveTo(bx, fy)
          ctx!.lineTo(bx + b.width, fy)
          ctx!.stroke()
          // Side floor lines
          ctx!.beginPath()
          ctx!.moveTo(bx + b.width, fy)
          ctx!.lineTo(bx + b.width + depthX, fy - depthY)
          ctx!.stroke()
          ctx!.globalAlpha = 1
        }

        // Window glow dots
        const windowCols = Math.floor(b.width / 10)
        const windowRows = Math.min(b.floors, Math.floor(b.height / 12))
        for (let wr = 0; wr < windowRows; wr++) {
          for (let wc = 0; wc < windowCols; wc++) {
            if (Math.random() < 0.3) continue
            const wx = bx + 5 + wc * (b.width / windowCols)
            const wy = by - 8 - wr * floorH
            const wAlpha = 0.03 + Math.sin(time * 0.02 + wc * 0.5 + wr * 0.7) * 0.02
            ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${wAlpha})`
            ctx!.fillRect(wx, wy, 3, 3)
          }
        }

        // Holographic scan line going up the building
        const scanPos = (time * 0.5 + b.phase * 50) % b.height
        const scanY = by - scanPos
        if (scanY > by - b.height && scanY < by) {
          const scanGrad = ctx!.createLinearGradient(bx, scanY - 4, bx, scanY + 4)
          scanGrad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0)`)
          scanGrad.addColorStop(0.5, `rgba(${c.r},${c.g},${c.b},${baseAlpha * 1.5})`)
          scanGrad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`)
          ctx!.fillStyle = scanGrad
          ctx!.fillRect(bx, scanY - 4, b.width + depthX, 8)
        }

        // Base glow
        const baseGlow = ctx!.createRadialGradient(bx + b.width / 2, by, 0, bx + b.width / 2, by, b.width)
        baseGlow.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${baseAlpha * 0.4})`)
        baseGlow.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`)
        ctx!.fillStyle = baseGlow
        ctx!.beginPath()
        ctx!.ellipse(bx + b.width / 2, by + 2, b.width * 0.8, 6, 0, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function drawDataStreams() {
      ctx!.font = '10px "Courier Prime", monospace'
      for (const stream of dataStreams) {
        stream.y += stream.speed
        if (stream.y > H + 200) {
          stream.y = -stream.length * 14
          stream.x = Math.random() * W
        }

        const c = stream.color
        for (let i = 0; i < stream.chars.length; i++) {
          const cy = stream.y + i * 14
          if (cy < -20 || cy > H + 20) continue
          const charAlpha = stream.opacity * (1 - i / stream.length)
          // Randomize char occasionally
          if (Math.random() < 0.02) {
            stream.chars[i] = RE_TERMS[Math.floor(Math.random() * RE_TERMS.length)].charAt(Math.floor(Math.random() * 8))
          }
          ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${charAlpha})`
          ctx!.fillText(stream.chars[i], stream.x, cy)
        }
      }
    }

    function drawParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life++

        if (p.life > p.maxLife || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
          particles[i] = createParticle()
          continue
        }

        const lifeFade = 1 - p.life / p.maxLife
        const alpha = p.opacity * lifeFade
        const c = p.color

        // Glow
        const glow = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
        glow.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${alpha * 0.3})`)
        glow.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`)
        ctx!.fillStyle = glow
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
        ctx!.fill()

        // Core
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`
        ctx!.fill()
      }
    }

    function drawFloatingTexts() {
      for (const ft of floatingTexts) {
        ft.phase += 0.008
        ft.x += ft.vx
        ft.y += ft.vy
        ft.opacity = ft.maxOpacity * (Math.sin(ft.phase) * 0.5 + 0.5)

        // Wrap around
        if (ft.x < -200) ft.x = W + 100
        if (ft.x > W + 200) ft.x = -100
        if (ft.y < -50) { ft.y = H + 30; ft.text = RE_TERMS[Math.floor(Math.random() * RE_TERMS.length)] }
        if (ft.y > H + 50) ft.y = -30

        const c = ft.color
        ctx!.font = `${ft.fontSize}px "Bebas Neue", sans-serif`
        ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${ft.opacity})`
        ctx!.textAlign = 'center'
        ctx!.fillText(ft.text, ft.x, ft.y)
      }
      ctx!.textAlign = 'start'
    }

    function drawMainText() {
      // Central "FLIP THE CONTRACT" with futuristic holographic glow
      const centerX = W / 2
      const centerY = H / 2

      // Responsive font size
      const fontSize = Math.min(W * 0.09, H * 0.12, 120)
      const subFontSize = fontSize * 0.22

      // Pulsing glow behind text
      const textPulse = Math.sin(time * 0.015) * 0.5 + 0.5

      // Outer glow
      const outerGlow = ctx!.createRadialGradient(centerX, centerY, 0, centerX, centerY, fontSize * 4)
      outerGlow.addColorStop(0, `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},${0.03 + textPulse * 0.02})`)
      outerGlow.addColorStop(0.5, `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},${0.01})`)
      outerGlow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx!.fillStyle = outerGlow
      ctx!.beginPath()
      ctx!.arc(centerX, centerY, fontSize * 4, 0, Math.PI * 2)
      ctx!.fill()

      // Horizontal scan line through text
      const scanOffset = Math.sin(time * 0.02) * fontSize * 0.8
      ctx!.fillStyle = `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},${0.015 + textPulse * 0.01})`
      ctx!.fillRect(centerX - fontSize * 3.5, centerY + scanOffset - 1, fontSize * 7, 2)

      // Glitch offset
      const glitch = Math.random() < 0.02 ? (Math.random() - 0.5) * 6 : 0

      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'

      // Shadow layers for depth
      ctx!.font = `${fontSize}px "Bebas Neue", sans-serif`

      // Chromatic aberration layers
      ctx!.globalAlpha = 0.04 + textPulse * 0.02
      ctx!.fillStyle = `rgba(${CYAN.r},${CYAN.g},${CYAN.b},1)`
      ctx!.fillText(FTC_TEXT, centerX - 2 + glitch, centerY + 1)
      ctx!.fillStyle = `rgba(${PURPLE.r},${PURPLE.g},${PURPLE.b},1)`
      ctx!.fillText(FTC_TEXT, centerX + 2 + glitch, centerY - 1)
      ctx!.globalAlpha = 1

      // Main text with gradient
      const textGrad = ctx!.createLinearGradient(
        centerX - fontSize * 2.5, centerY,
        centerX + fontSize * 2.5, centerY
      )
      const gradShift = (time * 0.003) % 1
      textGrad.addColorStop(0, `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},${0.15 + textPulse * 0.08})`)
      textGrad.addColorStop(0.3 + gradShift * 0.2, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${0.18 + textPulse * 0.1})`)
      textGrad.addColorStop(0.6 + gradShift * 0.1, `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},${0.2 + textPulse * 0.1})`)
      textGrad.addColorStop(1, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${0.12 + textPulse * 0.06})`)

      ctx!.fillStyle = textGrad
      ctx!.fillText(FTC_TEXT, centerX + glitch, centerY)

      // Outline stroke
      ctx!.strokeStyle = `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},${0.06 + textPulse * 0.04})`
      ctx!.lineWidth = 1
      ctx!.strokeText(FTC_TEXT, centerX + glitch, centerY)

      // Subtitle - "THE FUTURE OF WHOLESALE REAL ESTATE"
      ctx!.font = `${subFontSize}px "Bebas Neue", sans-serif`
      const subAlpha = 0.08 + textPulse * 0.04
      ctx!.fillStyle = `rgba(${CYAN.r},${CYAN.g},${CYAN.b},${subAlpha})`
      ctx!.letterSpacing = '0.3em'
      ctx!.fillText('THE FUTURE OF WHOLESALE REAL ESTATE', centerX, centerY + fontSize * 0.55)
      ctx!.letterSpacing = '0'

      // Decorative horizontal lines flanking text
      const lineWidth = ctx!.measureText(FTC_TEXT).width * 0.55
      const lineY = centerY + fontSize * 0.28
      const lineAlpha = 0.04 + textPulse * 0.03

      // Left line
      const leftLineGrad = ctx!.createLinearGradient(centerX - lineWidth - 40, lineY, centerX - lineWidth + 80, lineY)
      leftLineGrad.addColorStop(0, `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},0)`)
      leftLineGrad.addColorStop(1, `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},${lineAlpha})`)
      ctx!.strokeStyle = leftLineGrad
      ctx!.lineWidth = 1
      ctx!.beginPath()
      ctx!.moveTo(centerX - lineWidth - 40, lineY)
      ctx!.lineTo(centerX - lineWidth + 80, lineY)
      ctx!.stroke()

      // Right line
      const rightLineGrad = ctx!.createLinearGradient(centerX + lineWidth - 80, lineY, centerX + lineWidth + 40, lineY)
      rightLineGrad.addColorStop(0, `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},${lineAlpha})`)
      rightLineGrad.addColorStop(1, `rgba(${ORANGE.r},${ORANGE.g},${ORANGE.b},0)`)
      ctx!.strokeStyle = rightLineGrad
      ctx!.beginPath()
      ctx!.moveTo(centerX + lineWidth - 80, lineY)
      ctx!.lineTo(centerX + lineWidth + 40, lineY)
      ctx!.stroke()

      // Reset
      ctx!.textAlign = 'start'
      ctx!.textBaseline = 'alphabetic'
    }

    function drawScanLines() {
      // CRT-style horizontal scanlines
      ctx!.fillStyle = 'rgba(0,0,0,0.03)'
      for (let y = 0; y < H; y += 3) {
        ctx!.fillRect(0, y, W, 1)
      }

      // Moving scan bar
      const scanY = (time * 0.7) % (H + 100) - 50
      const scanGrad = ctx!.createLinearGradient(0, scanY - 30, 0, scanY + 30)
      scanGrad.addColorStop(0, 'rgba(255,255,255,0)')
      scanGrad.addColorStop(0.5, 'rgba(255,255,255,0.008)')
      scanGrad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx!.fillStyle = scanGrad
      ctx!.fillRect(0, scanY - 30, W, 60)
    }

    function drawVignette() {
      const vignette = ctx!.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.75)
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(0.6, 'rgba(0,0,0,0.05)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.3)')
      ctx!.fillStyle = vignette
      ctx!.fillRect(0, 0, W, H)
    }

    // Orbiting data rings around center
    function drawDataRings() {
      const cx = W / 2
      const cy = H / 2
      const rings = [
        { radius: Math.min(W, H) * 0.2, speed: 0.0008, dots: 40, color: ORANGE },
        { radius: Math.min(W, H) * 0.3, speed: -0.0005, dots: 60, color: CYAN },
        { radius: Math.min(W, H) * 0.42, speed: 0.0003, dots: 80, color: PURPLE },
      ]

      for (const ring of rings) {
        const angle = time * ring.speed
        const c = ring.color

        // Ring line
        ctx!.beginPath()
        ctx!.arc(cx, cy, ring.radius, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.02)`
        ctx!.lineWidth = 0.5
        ctx!.stroke()

        // Orbiting dots
        for (let i = 0; i < ring.dots; i++) {
          const dotAngle = angle + (Math.PI * 2 / ring.dots) * i
          const dx = cx + Math.cos(dotAngle) * ring.radius
          const dy = cy + Math.sin(dotAngle) * ring.radius
          const dotPulse = Math.sin(time * 0.02 + i * 0.3) * 0.5 + 0.5
          const dotAlpha = 0.02 + dotPulse * 0.03

          ctx!.beginPath()
          ctx!.arc(dx, dy, 1, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${dotAlpha})`
          ctx!.fill()
        }

        // Brighter lead dot
        const leadAngle = angle
        const lx = cx + Math.cos(leadAngle) * ring.radius
        const ly = cy + Math.sin(leadAngle) * ring.radius
        const leadGlow = ctx!.createRadialGradient(lx, ly, 0, lx, ly, 10)
        leadGlow.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.12)`)
        leadGlow.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`)
        ctx!.fillStyle = leadGlow
        ctx!.beginPath()
        ctx!.arc(lx, ly, 10, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    // ── Main loop ──
    function draw() {
      time++

      // Skip every other frame on mobile for better performance
      if (isMobile && time % 2 !== 0) {
        animationId = requestAnimationFrame(draw)
        return
      }

      drawBackground()
      drawHexGrid()
      drawGridNetwork()
      drawDataStreams()
      drawHoloBuildings()
      drawParticles()
      drawFloatingTexts()
      drawDataRings()
      drawMainText()
      drawScanLines()
      drawVignette()

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="shooting-stars-canvas"
      aria-hidden="true"
    />
  )
}
