import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Gestion } from './pages/Gestion';
import { VosDonnees } from './pages/VosDonnees';
import { MiseEnLocation } from './pages/MiseEnLocation';
import { LocCourte } from './pages/LocCourte';
import { Editions } from './pages/Editions';
import { Communication } from './pages/Communication';
import { Finances } from './pages/Finances';
import { Encaissements } from './pages/Encaissements';
import { Icones } from './pages/Icones';
import { Motion } from './pages/Motion';
import { MotionSolo } from './pages/Motion/Solo';
import { Mockups } from './pages/Mockups';
import { Comptabilite } from './pages/Comptabilite';
import { Sinistres } from './pages/Sinistres';
import { AutomatisationsLoyers } from './pages/AutomatisationsLoyers';
import { MandatVente } from './pages/MandatVente';
import { PortefeuilleTransactions } from './pages/PortefeuilleTransactions';
import { Diffusion } from './pages/Diffusion';
import { DemandesClients } from './pages/DemandesClients';
import { PitchGestion } from './pages/PitchGestion';
import { TableauDeBordGlobal } from './pages/TableauDeBordGlobal';
import { SuiviLoyersRentabilite } from './pages/SuiviLoyersRentabilite';
import { IndicateursPersonnalises } from './pages/IndicateursPersonnalises';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/"                  element={<Layout><Dashboard /></Layout>} />
        <Route path="/finances"          element={<Layout><Finances /></Layout>} />
        <Route path="/encaissements"     element={<Layout><Encaissements /></Layout>} />
        <Route path="/icones"            element={<Layout><Icones /></Layout>} />
        <Route path="/motion"            element={<Layout><Motion /></Layout>} />
        <Route path="/mockups"           element={<Layout><Mockups /></Layout>} />
        {/* Page de capture : hors Layout, aucune chrome autour de la scène */}
        <Route path="/capture/:id"       element={<MotionSolo />} />
        <Route path="/comptabilite"      element={<Layout><Comptabilite /></Layout>} />
        <Route path="/sinistres"         element={<Layout><Sinistres /></Layout>} />
        <Route path="/automatisations-loyers" element={<Layout><AutomatisationsLoyers /></Layout>} />
        <Route path="/mandat-vente"      element={<Layout><MandatVente /></Layout>} />
        <Route path="/portefeuille-transactions" element={<Layout><PortefeuilleTransactions /></Layout>} />
        <Route path="/donnees"           element={<Layout><VosDonnees /></Layout>} />
        <Route path="/gestion"           element={<Layout><Gestion /></Layout>} />
        <Route path="/mise-en-location"  element={<Layout><MiseEnLocation /></Layout>} />
        <Route path="/loc-courte-duree"  element={<Layout><LocCourte /></Layout>} />
        <Route path="/editions"          element={<Layout><Editions /></Layout>} />
        <Route path="/communication"     element={<Layout><Communication /></Layout>} />
        <Route path="/diffusion"         element={<Layout><Diffusion /></Layout>} />
        <Route path="/demandes-clients"  element={<Layout><DemandesClients /></Layout>} />
        <Route path="/tableau-de-bord-global"      element={<Layout><TableauDeBordGlobal /></Layout>} />
        <Route path="/suivi-loyers-rentabilite"    element={<Layout><SuiviLoyersRentabilite /></Layout>} />
        <Route path="/indicateurs-personnalises"   element={<Layout><IndicateursPersonnalises /></Layout>} />
        <Route path="/pitch-gestion"     element={<Layout><PitchGestion /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
