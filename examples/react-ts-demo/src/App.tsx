import './App.css';

// @ts-ignore
import ReactLogo from './assets/react.svg?component';
const App = () => {
  return (
    <div className="content">
      <div style={{ margin: '12px auto;' }}>
        <ReactLogo style={{ width: '100px', height: '100px' }} />
      </div>
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
    </div>
  );
};

export default App;
