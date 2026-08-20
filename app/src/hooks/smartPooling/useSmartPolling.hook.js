import { useEffect, useRef } from 'react';

/**
 * Hook para executar uma função repetidamente apenas quando a aba estiver visível.
 * @param {Function} callback - Função que faz a busca na API
 * @param {number} intervalMs - Intervalo em ms (Padrão: 10 segundos)
 */
export function useSmartPolling(callback, intervalMs = 10000) {
  const savedCallback = useRef(callback);

  // Mantém a referência da função sempre atualizada sem redefinir os timers
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // 1. Função única para verificar a visibilidade e executar a callback
    const executeCallbackIfVisible = () => {
      if (document.visibilityState === 'visible') {
        savedCallback.current();
      }
    };

    // 2. Configura o intervalo repetitivo usando a função reutilizável
    const intervalId = setInterval(executeCallbackIfVisible, intervalMs);

    // 3. Listener para disparar a busca quando o usuário retorna para a aba
    document.addEventListener('visibilitychange', executeCallbackIfVisible);

    // 4. Limpeza de memória
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', executeCallbackIfVisible);
    };
  }, [intervalMs]);
}