'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CodeiumEditor } from '@codeium/react-code-editor';
import { useEffect } from 'react';

interface CodeEditorProps {
  onCodeChange: (code?: string) => void;
}

export function CodeEditor(props: CodeEditorProps) {
  const [code, setCode] = useLocalStorage('code', `#Write your code\nx=1\ny=1\nz=1\ninit(x,y,z)\nmove(x,y,z)\nstop()`);
  useEffect(() => {
    props.onCodeChange(code);
  }, []);

  const handleCodeChange = (code?: string) => {
    setCode(code??'');
    props.onCodeChange(code);
  }

  return <CodeiumEditor 
    language="python" 
    theme="vs-dark" 
    defaultValue={code}
    className='!h-[300px]  md:!h-[700px]'
    containerClassName='!h-[300px]  md:!h-[700px]'
    onChange={(code) => handleCodeChange(code)}
    options={{
    suggest: {
      showWords: true,
      showClasses: true,
      showColors: true,
      showFiles: true,
    },
  }} />;
}