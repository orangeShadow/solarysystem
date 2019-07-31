import './app.css';
import SolarSystem from './solar-system';

function emit(event, data) {
  if (!window.top) return;
  window.top.postMessage({ event, data });
}

const solarSystem = new SolarSystem({
  onLoad() {
    emit('onLoad');
  },
  onRunToPlanet(planet) {
    emit('onRunToPlanet', { planet });
  },
  onRunToPlanetComplete(planet) {
    emit('onRunToPlanetComplete', { planet });
  },
  onRunToOverview() {
    emit('onRunToOverview');
  },
  onRunToOverviewComplete() {
    emit('onRunToOverviewComplete');
  },
});
window.solarSystem = solarSystem;

window.addEventListener('message', (e) => {
  const { event, data = {} } = e.data;
  if (event === 'runToPlanet') {
    const { planet, params } = data;
    solarSystem.runToPlanet(planet, params);
  }
  if (event === 'runToOverview') {
    const { params } = data;
    solarSystem.runToOverview(params);
  }
  if (event === 'destroy') {
    solarSystem.destroy();
  }
  if (event === 'allowPlanetClick') {
    solarSystem.allowPlanetClick = data;
  }
});


export default solarSystem;
