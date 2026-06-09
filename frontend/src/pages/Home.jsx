import PageMeta from '../components/PageMeta';
import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Portfolio from '../components/Portfolio'
import Skills from '../components/Skills'
import WhyMe from '../components/WhyMe'
import Reviews from '../components/Reviews'
import ReviewForm from '../components/ReviewForm'
import FreelanceLinks from '../components/FreelanceLinks'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <PageMeta />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Skills />
      <WhyMe />
      <Reviews />
      <ReviewForm />
      <FreelanceLinks />
      <Contact />
    </>
  );
}
