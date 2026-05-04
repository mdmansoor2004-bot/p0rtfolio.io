import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GSAP from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Initialize GSAP
GSAP.registerPlugin(ScrollTrigger)

// Initialize Lenis for smooth scroll
const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
GSAP.ticker.add((time) => {
  lenis.raf(time * 1000)
})
GSAP.ticker.lagSmoothing(0)

// --- Three.js Setup ---
const canvas = document.querySelector('#bg-canvas')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)

// --- Particles Background ---
const particlesCount = 1000 // Reduced from 2000 for performance
const positions = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.2,
  color: 0x00f2ff,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// --- 3D Geometric Accents ---
const group = new THREE.Group()
scene.add(group)

const torusKnotGeometry = new THREE.TorusKnotGeometry(10, 3, 60, 12) // Simplified geometry
const torusKnotMaterial = new THREE.MeshPhongMaterial({
  color: 0xbc13fe,
  wireframe: true,
  transparent: true,
  opacity: 0.1
})
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)
group.add(torusKnot)

// Floating Social Logos (Simplified as 3D Objects)
const createSocialObject = (color, x, y, z) => {
  const geo = new THREE.IcosahedronGeometry(1.5, 0) // Already low poly
  const mat = new THREE.MeshStandardMaterial({ 
    color: color, 
    emissive: color,
    emissiveIntensity: 1, // Reduced intensity
    wireframe: true 
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(x, y, z)
  group.add(mesh)
  return mesh
}

const instaObj = createSocialObject(0xff0066, 15, 10, -10)
const githubObj = createSocialObject(0xffffff, -15, -10, -5)
const linkedinObj = createSocialObject(0x0077b5, 10, -15, -8)

// Lights
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5, 5, 5)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(pointLight, ambientLight)

// --- Mouse Interaction ---
let mouseX = 0
let mouseY = 0
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2
})

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate)

  const isMobile = window.innerWidth < 768
  
  // Constant rotation for energy
  group.rotation.y += 0.003
  group.rotation.z += 0.001

  // Dynamic scaling for mobile
  group.scale.setScalar(isMobile ? 0.6 : 1)
  particles.scale.setScalar(isMobile ? 0.8 : 1)

  // Social objects internal rotation
  instaObj.rotation.x += 0.02
  githubObj.rotation.y += 0.02
  linkedinObj.rotation.z += 0.02

  renderer.render(scene, camera)
}
animate()

// --- Resize Handling ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// --- GSAP Animations ---
// Contact form handling
const contactForm = document.querySelector('.contact-form form')
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const btn = contactForm.querySelector('button')
    const originalText = btn.innerText
    btn.innerText = 'Sending...'
    btn.disabled = true
    
    setTimeout(() => {
      alert('Thank you for your message, Mohammed Mansoor will get back to you soon!')
      contactForm.reset()
      btn.innerText = originalText
      btn.disabled = false
    }, 1500)
  })
}

// --- Scroll Linked 3D Parallax ---
GSAP.to(group.position, {
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1
  },
  z: 10,
  y: -5
})

GSAP.to(particles.rotation, {
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 2
  },
  x: 1,
  y: 1
})

// --- GSAP Animations ---
// Hero reveal
const heroTl = GSAP.timeline()
heroTl.from('.hero-content h1', {
  y: 100,
  opacity: 0,
  duration: 1.5,
  ease: 'expo.out'
})
.from('.neon-accent', {
  x: -100,
  opacity: 0,
  duration: 1,
  ease: 'power4.out'
}, '-=1')
.from('.subheading', {
  opacity: 0,
  letterSpacing: '0px',
  duration: 1.5,
  ease: 'power2.out'
}, '-=0.5')
.from('.cta-group .btn', {
  scale: 0,
  opacity: 0,
  stagger: 0.2,
  duration: 0.8,
  ease: 'back.out(1.7)'
}, '-=1')

// Section scroll animations
const sections = document.querySelectorAll('.section')
sections.forEach((section, index) => {
  const isEven = index % 2 === 0
  
  // Only animate the top-level containers to avoid conflicts
  const revealElements = section.querySelectorAll('.section-title, .glass-card, .project-card, .timeline-item')
  
  GSAP.from(revealElements, {
    scrollTrigger: {
      trigger: section,
      start: 'top 92%', // Trigger very early
      toggleActions: 'play none none none' // Don't reverse so they stay visible
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out',
    onComplete: () => {
      // Ensure visibility is forced at the end
      GSAP.set(revealElements, { opacity: 1, visibility: 'visible' })
    }
  })

  // Staggered Skill items (only in skills section)
  const listItems = section.querySelectorAll('li')
  if (listItems.length > 0) {
    GSAP.from(listItems, {
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      },
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power1.out'
    })
  }
})

// Refresh ScrollTrigger to ensure correct positions
ScrollTrigger.refresh()

// Special parallax for project images
GSAP.utils.toArray('.project-img img').forEach(img => {
  GSAP.to(img, {
    scrollTrigger: {
      trigger: img,
      scrub: true,
      start: 'top bottom',
      end: 'bottom top'
    },
    scale: 1.3,
    y: -30,
    ease: 'none'
  })
})

// Social links floating animation
const socialItems = document.querySelectorAll('.social-item')
socialItems.forEach((item, index) => {
  GSAP.to(item, {
    y: 20,
    duration: 1.2 + index * 0.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
})
