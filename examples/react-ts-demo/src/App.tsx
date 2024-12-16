import './App.css';

// @ts-ignore
import ReactLogo from './assets/react.svg?component';
// @ts-ignore
import styles from "./index.module.css"
const App = () => {
  return (
    <div className="content">
      <div style={{ margin: '12px auto;' }}>
        <ReactLogo style={{ width: '100px', height: '100px' }} />
      </div>
      <h1 className={styles.title}>@fett/quick-cli with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
    </div>
  );
};

export default App;
