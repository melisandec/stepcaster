import miniapp from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { GamificationProvider } from "./components/GamificationProvider";
import { GamificationDashboard } from "./components/GamificationDashboard";
import "./App.css";

function App() {
  const [showGamification, setShowGamification] = useState(false);

  useEffect(() => {
    miniapp.actions.ready();
  }, []);

  return (
    <GamificationProvider>
      <div className="app">
        <header className="app-header">
          <h1>🚶‍♂️ Step Caster</h1>
          <div className="header-actions">
            <button 
              className="toggle-button"
              onClick={() => setShowGamification(!showGamification)}
            >
              {showGamification ? '📊 Basic Mode' : '🎮 Gamification Mode'}
            </button>
          </div>
        </header>

        <main className="app-main">
          {showGamification ? (
            <GamificationDashboard />
          ) : (
            <BasicMode />
          )}
        </main>
      </div>
    </GamificationProvider>
  );
}

function BasicMode() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <div className="basic-mode">
        <div className="welcome-section">
          <h2>Welcome to Daily Steps Uploader!</h2>
          <p>Connected account: {address}</p>
          <p>Upload your daily steps and share your fitness journey on Farcaster.</p>
        </div>
        <StepUploader />
        <SignButton />
      </div>
    );
  }

  return (
    <div className="connect-section">
      <h2>Connect Your Wallet</h2>
      <p>Connect your wallet to start uploading your daily steps and earning rewards!</p>
      <button 
        type="button" 
        className="connect-button"
        onClick={() => connect({ connector: connectors[0] })}
      >
        🔗 Connect Wallet
      </button>
    </div>
  );
}

function StepUploader() {
  const [steps, setSteps] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    const stepCount = parseInt(steps);
    if (isNaN(stepCount) || stepCount <= 0) {
      setMessage('Please enter a valid number of steps.');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      await miniapp.actions.composeCast({
        text: `🚶‍♂️ Today's steps: ${stepCount.toLocaleString()}`
      });
      
      setMessage('✅ Steps uploaded successfully to Farcaster!');
      setSteps('');
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('❌ Failed to upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="step-uploader">
      <h3>📊 Upload Your Steps</h3>
      <div className="upload-form">
        <input
          type="number"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="Enter your steps for today"
          className="steps-input"
          min="0"
          max="999999"
        />
        <button
          onClick={handleUpload}
          disabled={isUploading || !steps}
          className="upload-button"
        >
          {isUploading ? 'Uploading...' : '🚶‍♂️ Upload to Farcaster'}
        </button>
      </div>
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

function SignButton() {
  const { signMessage, isPending, data, error } = useSignMessage();

  return (
    <div className="sign-section">
      <h3>🔐 Message Signing</h3>
      <button 
        type="button" 
        className="sign-button"
        onClick={() => signMessage({ message: "hello world" })} 
        disabled={isPending}
      >
        {isPending ? "Signing..." : "Sign message"}
      </button>
      {data && (
        <div className="signature-result">
          <h4>Signature</h4>
          <div className="signature-text">{data}</div>
        </div>
      )}
      {error && (
        <div className="signature-error">
          <h4>Error</h4>
          <div className="error-text">{error.message}</div>
        </div>
      )}
    </div>
  );
}

export default App;
