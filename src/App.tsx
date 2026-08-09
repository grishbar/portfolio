import { useLenis } from './lib/useLenis'
import { Cursor, CursorGlow } from './components/Cursor'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Experience } from './sections/Experience'
import { Skills } from './sections/Skills'
import { Teaching } from './sections/Teaching'
import { Education } from './sections/Education'
import { Contact } from './sections/Contact'

export default function App() {
  useLenis()

  return (
    <>
      <CursorGlow />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Teaching />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
