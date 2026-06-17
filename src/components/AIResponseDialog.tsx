import React, { useState } from 'react';
import { Dialog } from './Dialog';


interface AIResponseDialogProps {
  role:string;
  isOpen: boolean;
  onClose: () => void;
  taggedMessage:string;
}

type DialogState = 'form' | 'loading' | 'response' | 'success';

const RESPONSE_URL = import.meta.env.VITE_API_URL+'/tickets/generate-response'
export const AIResponseDialog: React.FC<AIResponseDialogProps> = ({
  role,
  isOpen,
  onClose,
  taggedMessage
}) => {
  const messageRole = role == "CUSTOMER"? "customer": "support agent"
  const [prompt, setPrompt] = useState(`Generate a polite response as a ${messageRole}`);
  const [message, setMessage] = useState(taggedMessage);
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [state, setState] = useState<DialogState>('form');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleCopy(){
    await navigator.clipboard.writeText(generatedResponse);
    alert("Copied Response")
  }
  const handleGenerate = async () => {
    if (!prompt.trim() || !message.trim()) {
      setError('Please fill in both fields');
      return;
    }

    setError('');
    setState('loading');
    setIsGenerating(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(RESPONSE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          prompt,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      setGeneratedResponse(data.response);
      setState('response');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setState('form');
    } finally {
      setIsGenerating(false);
    }
  };


  const handleRegenerate = async () => {
    setState('loading');
    setIsGenerating(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(RESPONSE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          prompt,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate response');
      }

      const data = await response.json();
      setGeneratedResponse(data.response);
      setState('response');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setState('form');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetDialog = () => {
    setPrompt('');
    setMessage('');
    setGeneratedResponse('');
    setState('form');
    setError('');
    onClose();
  };

  // Form view
  if (state === 'form' || state === 'loading') {
    return (
      <Dialog
        isOpen={isOpen}
        onClose={resetDialog}
        title="Generate AI response"
        description="Create a response using AI assistance"
        primaryAction={{
          label: state === 'loading' ? 'Generating...' : 'Generate response',
          onClick: handleGenerate,
          loading: isGenerating || state === 'loading',
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: resetDialog,
        }}
      >
        <div className="space-y-6">
          {/* Prompt textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0d1117] dark:text-white">
              System prompt
            </label>
            <textarea
              placeholder="Define the AI behavior and tone..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={state === 'loading'}
              className="w-full min-h-[100px] px-3 py-2 text-sm border border-[#c6c6cd] dark:border-[#2e3347] rounded-lg bg-white dark:bg-[#1a1f35] text-[#0d1117] dark:text-white placeholder-[#6b7280] dark:placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0058be] dark:focus:ring-[#5b9ff5] disabled:opacity-50 resize-vertical"
            />
          </div>

          {/* Message textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0d1117] dark:text-white">
              Customer message
            </label>
            <textarea
              placeholder="Paste the message you need to reply to..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={state === 'loading'}
              className="w-full min-h-[100px] px-3 py-2 text-sm border border-[#c6c6cd] dark:border-[#2e3347] rounded-lg bg-white dark:bg-[#1a1f35] text-[#0d1117] dark:text-white placeholder-[#6b7280] dark:placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0058be] dark:focus:ring-[#5b9ff5] disabled:opacity-50 resize-vertical"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#fef2f2] dark:bg-[#7f1d1d] rounded-lg">
              <i className="ti ti-alert-circle text-[#dc2626] dark:text-[#fca5a5]" />
              <span className="text-sm text-[#991b1b] dark:text-[#fecaca]">{error}</span>
            </div>
          )}

          {/* Loading state */}
          {state === 'loading' && (
            <div className="flex items-center justify-center gap-3 py-6">
              <div className="w-5 h-5 border-2 border-[#e5e7eb] dark:border-[#374151] border-t-[#0058be] dark:border-t-[#5b9ff5] rounded-full animate-spin" />
              <span className="text-sm text-[#6b7280] dark:text-[#9ca3af]">Generating response...</span>
            </div>
          )}
        </div>
      </Dialog>
    );
  }

  // Response view
  if (state === 'response') {
    return (
      <Dialog
        isOpen={isOpen}
        onClose={resetDialog}
        title="Generated response"
        description="Review the AI-generated response"
        primaryAction={{
          label: 'Copy response',
          onClick: handleCopy,
        }}
        secondaryAction={{
          label: 'Regenerate',
          onClick: handleRegenerate,
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0d1117] dark:text-white mb-2">
              Generated response
            </label>
            <div className="p-3 bg-[#f3f4f6] dark:bg-[#1f2937] border border-[#c6c6cd] dark:border-[#374151] rounded-lg min-h-[120px] max-h-[250px] overflow-y-auto text-sm text-[#0d1117] dark:text-white whitespace-pre-wrap">
              {generatedResponse}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }

  // Success view
  if (state === 'success') {
    return (
      <Dialog
        isOpen={isOpen}
        onClose={resetDialog}
        title="Success"
        description=""
      >
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <i className="ti ti-circle-check text-5xl text-[#10b981] dark:text-[#6ee7b7]" />
          <p className="text-base font-medium text-[#0d1117] dark:text-white text-center">
            Response sent successfully!
          </p>
        </div>
      </Dialog>
    );
  }

  return null;
};

export default AIResponseDialog;
