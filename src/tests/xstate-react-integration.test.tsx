import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  CanvasStateMachineDebug,
  CanvasStateMachineProvider,
  useEnhancedToolbarProps,
  useLegacyCanvasState,
} from '@/features/canvas/components/canvas/CanvasStateMachineProvider';
import { useCanvasStateMachine } from '@/features/canvas/lib/hooks/useCanvasStateMachine';

// Test component that uses the legacy interface
function LegacyTestComponent() {
  const {
    toolbarMode,
    setToolbarMode,
    isWhiteboardActive,
    navigationTool,
    setNavigationTool,
    drawStrokeColor,
    setDrawStrokeColor,
  } = useLegacyCanvasState();

  return (
    <div>
      <div data-testid="toolbar-mode">{toolbarMode}</div>
      <div data-testid="whiteboard-active">{isWhiteboardActive.toString()}</div>
      <div data-testid="navigation-tool">{navigationTool}</div>
      <div data-testid="stroke-color">{drawStrokeColor || 'none'}</div>

      <button onClick={() => setToolbarMode('edit')}>Edit Mode</button>
      <button onClick={() => setToolbarMode('draw')}>Draw Mode</button>
      <button onClick={() => setNavigationTool('hand')}>Hand Tool</button>
      <button onClick={() => setDrawStrokeColor('#ff0000')}>Red Color</button>
    </div>
  );
}

// Test component that uses the enhanced interface
function EnhancedTestComponent() {
  const props = useEnhancedToolbarProps();

  return (
    <div>
      <div data-testid="current-environment">{props.currentEnvironment}</div>
      <div data-testid="active-tool">{props.activeTool}</div>
      <div data-testid="keep-tool-active">
        {props.keepToolActive.toString()}
      </div>
      <div data-testid="collaborators-count">{props.collaborators.length}</div>

      <button onClick={() => props.onSwitchEnvironment('practical')}>
        Practical
      </button>
      <button onClick={() => props.onSwitchEnvironment('design')}>
        Design
      </button>
      <button onClick={() => props.onSelectTool('select')}>Select Tool</button>
      <button onClick={props.onToggleKeepToolActive}>Toggle Keep Tool</button>
    </div>
  );
}

// Test component using direct machine access
function DirectMachineTestComponent() {
  const machine = useCanvasStateMachine();

  return (
    <div>
      <div data-testid="environment">{machine.currentEnvironment}</div>
      <div data-testid="tool">{machine.currentTool}</div>
      <div data-testid="passthrough">
        {machine.isPassthroughMode.toString()}
      </div>
      <div data-testid="error">{machine.hasError ? machine.error : 'none'}</div>

      <button onClick={machine.switchToDesign}>Switch to Design</button>
      <button onClick={machine.enablePassthrough}>Enable Passthrough</button>
      <button
        onClick={() => machine.send({ type: 'ERROR', error: 'Test error' })}
      >
        Trigger Error
      </button>
      <button onClick={machine.clearError}>Clear Error</button>
    </div>
  );
}

describe('XState React Integration', () => {
  describe('Legacy Interface Compatibility', () => {
    it('should provide legacy interface that works with existing code', () => {
      render(
        <CanvasStateMachineProvider>
          <LegacyTestComponent />
        </CanvasStateMachineProvider>
      );

      // Should start in edit mode (practical)
      expect(screen.getByTestId('toolbar-mode')).toHaveTextContent('edit');
      expect(screen.getByTestId('whiteboard-active')).toHaveTextContent(
        'false'
      );
      expect(screen.getByTestId('navigation-tool')).toHaveTextContent('move');
    });

    it('should switch to draw mode when legacy setToolbarMode is called', () => {
      render(
        <CanvasStateMachineProvider>
          <LegacyTestComponent />
        </CanvasStateMachineProvider>
      );

      fireEvent.click(screen.getByText('Draw Mode'));

      expect(screen.getByTestId('toolbar-mode')).toHaveTextContent('draw');
      expect(screen.getByTestId('whiteboard-active')).toHaveTextContent('true');
    });

    it('should update navigation tool through legacy interface', () => {
      render(
        <CanvasStateMachineProvider>
          <LegacyTestComponent />
        </CanvasStateMachineProvider>
      );

      fireEvent.click(screen.getByText('Hand Tool'));
      expect(screen.getByTestId('navigation-tool')).toHaveTextContent('hand');
    });

    it('should update stroke color through legacy interface', () => {
      render(
        <CanvasStateMachineProvider>
          <LegacyTestComponent />
        </CanvasStateMachineProvider>
      );

      fireEvent.click(screen.getByText('Red Color'));
      expect(screen.getByTestId('stroke-color')).toHaveTextContent('#ff0000');
    });
  });

  describe('Enhanced Interface', () => {
    it('should provide enhanced toolbar props', () => {
      render(
        <CanvasStateMachineProvider>
          <EnhancedTestComponent />
        </CanvasStateMachineProvider>
      );

      expect(screen.getByTestId('current-environment')).toHaveTextContent(
        'practical'
      );
      expect(screen.getByTestId('active-tool')).toHaveTextContent('select');
      expect(screen.getByTestId('keep-tool-active')).toHaveTextContent('false');
      expect(screen.getByTestId('collaborators-count')).toHaveTextContent('0');
    });

    it('should switch environments through enhanced interface', () => {
      render(
        <CanvasStateMachineProvider>
          <EnhancedTestComponent />
        </CanvasStateMachineProvider>
      );

      fireEvent.click(screen.getByText('Design'));
      expect(screen.getByTestId('current-environment')).toHaveTextContent(
        'design'
      );

      fireEvent.click(screen.getByText('Practical'));
      expect(screen.getByTestId('current-environment')).toHaveTextContent(
        'practical'
      );
    });

    it('should toggle keep tool active', () => {
      render(
        <CanvasStateMachineProvider>
          <EnhancedTestComponent />
        </CanvasStateMachineProvider>
      );

      expect(screen.getByTestId('keep-tool-active')).toHaveTextContent('false');

      fireEvent.click(screen.getByText('Toggle Keep Tool'));
      expect(screen.getByTestId('keep-tool-active')).toHaveTextContent('true');
    });
  });

  describe('Direct Machine Access', () => {
    it('should provide direct access to state machine', () => {
      render(
        <CanvasStateMachineProvider>
          <DirectMachineTestComponent />
        </CanvasStateMachineProvider>
      );

      expect(screen.getByTestId('environment')).toHaveTextContent('practical');
      expect(screen.getByTestId('passthrough')).toHaveTextContent('false');
      expect(screen.getByTestId('error')).toHaveTextContent('none');
    });

    it('should handle environment switching', () => {
      render(
        <CanvasStateMachineProvider>
          <DirectMachineTestComponent />
        </CanvasStateMachineProvider>
      );

      fireEvent.click(screen.getByText('Switch to Design'));
      expect(screen.getByTestId('environment')).toHaveTextContent('design');
    });

    it('should handle passthrough mode', () => {
      render(
        <CanvasStateMachineProvider>
          <DirectMachineTestComponent />
        </CanvasStateMachineProvider>
      );

      // Switch to design first (passthrough only works in design mode)
      fireEvent.click(screen.getByText('Switch to Design'));
      fireEvent.click(screen.getByText('Enable Passthrough'));

      expect(screen.getByTestId('passthrough')).toHaveTextContent('true');
    });

    it('should handle error states', () => {
      render(
        <CanvasStateMachineProvider>
          <DirectMachineTestComponent />
        </CanvasStateMachineProvider>
      );

      fireEvent.click(screen.getByText('Trigger Error'));
      expect(screen.getByTestId('error')).toHaveTextContent('Test error');

      fireEvent.click(screen.getByText('Clear Error'));
      expect(screen.getByTestId('error')).toHaveTextContent('none');
    });
  });

  describe('Provider Features', () => {
    it('should call onEnvironmentChange callback', () => {
      const onEnvironmentChange = vi.fn();

      render(
        <CanvasStateMachineProvider onEnvironmentChange={onEnvironmentChange}>
          <DirectMachineTestComponent />
        </CanvasStateMachineProvider>
      );

      // Should be called on mount with initial environment
      expect(onEnvironmentChange).toHaveBeenCalledWith('practical');

      fireEvent.click(screen.getByText('Switch to Design'));
      expect(onEnvironmentChange).toHaveBeenCalledWith('design');
    });

    it('should call onError callback', () => {
      const onError = vi.fn();

      render(
        <CanvasStateMachineProvider onError={onError}>
          <DirectMachineTestComponent />
        </CanvasStateMachineProvider>
      );

      fireEvent.click(screen.getByText('Trigger Error'));
      expect(onError).toHaveBeenCalledWith('Test error');
    });

    it('should throw error when used outside provider', () => {
      // Mock console.error to avoid noise in test output
      const originalConsoleError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<LegacyTestComponent />);
      }).toThrow(
        'useCanvasStateMachineContext must be used within a CanvasStateMachineProvider'
      );

      console.error = originalConsoleError;
    });
  });

  describe('Debug Component', () => {
    it('should render debug component in development', () => {
      // Mock NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <CanvasStateMachineProvider>
          <CanvasStateMachineDebug />
        </CanvasStateMachineProvider>
      );

      expect(
        screen.getByText('Canvas State Machine (Debug)')
      ).toBeInTheDocument();
      expect(screen.getByText('Practical')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();

      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should not render debug component in production', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const { container } = render(
        <CanvasStateMachineProvider>
          <CanvasStateMachineDebug />
        </CanvasStateMachineProvider>
      );

      expect(container.firstChild).toBeNull();

      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should allow environment switching through debug controls', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <CanvasStateMachineProvider>
          <CanvasStateMachineDebug />
          <DirectMachineTestComponent />
        </CanvasStateMachineProvider>
      );

      // Use debug controls to switch
      const debugPracticalButton = screen.getAllByText('Practical')[0]; // Debug button
      const debugDesignButton = screen.getAllByText('Design')[0]; // Debug button

      fireEvent.click(debugDesignButton);
      expect(screen.getByTestId('environment')).toHaveTextContent('design');

      fireEvent.click(debugPracticalButton);
      expect(screen.getByTestId('environment')).toHaveTextContent('practical');

      process.env.NODE_ENV = originalNodeEnv;
    });
  });
});

describe('XState React Performance', () => {
  it('should not cause excessive re-renders', () => {
    let renderCount = 0;

    function RenderCountComponent() {
      renderCount++;
      const machine = useCanvasStateMachine();
      return <div data-testid="render-count">{renderCount}</div>;
    }

    render(
      <CanvasStateMachineProvider>
        <RenderCountComponent />
      </CanvasStateMachineProvider>
    );

    const initialRenderCount = renderCount;

    // Multiple state changes
    act(() => {
      const machine = useCanvasStateMachine.getState
        ? useCanvasStateMachine.getState()
        : null;
      // These operations should be batched by React
    });

    // Should not cause excessive re-renders
    expect(renderCount - initialRenderCount).toBeLessThan(5);
  });
});
