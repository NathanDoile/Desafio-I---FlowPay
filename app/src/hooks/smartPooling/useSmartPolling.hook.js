import { useEffect, useRef } from 'react';

export function useSmartPolling(callback, intervalMs = 10000) {
  const savedCallback = useRef(callback);

  // Mantém a referência da função sempre atualizada sem acionar re-renders
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // Função auxiliar que só roda se a aba estiver visível
    const tick = () => {
      if (document.visibilityState === 'visible') {
        savedCallback.current();
      }
    };

    // 1. Cria o timer
    const id = setInterval(tick, intervalMs);

    // 2. Dispara a requisição imediatamente quando o usuário volta para a aba
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        savedCallback.current();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 3. Limpa o timer e o event listener
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs]); // Apenas intervalMs nas dependências para o timer NUNCA resetar em loop
}