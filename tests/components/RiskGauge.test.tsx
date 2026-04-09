// tests/components/RiskGauge.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RiskGauge from '../../components/RiskGauge';

describe('RiskGauge', () => {
  it('점수를 표시한다', () => {
    render(<RiskGauge score={85} />);
    expect(screen.getByText('85')).toBeDefined();
  });

  it('80점 이상은 빨간색 클래스를 가진다', () => {
    const { container } = render(<RiskGauge score={85} />);
    expect(container.innerHTML).toContain('red');
  });

  it('50~79점은 주황색 클래스를 가진다', () => {
    const { container } = render(<RiskGauge score={65} />);
    expect(container.innerHTML).toContain('orange');
  });
});
