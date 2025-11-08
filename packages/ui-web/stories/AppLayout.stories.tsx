import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../src/components/AppLayout';
import { Feature } from '../src/components/Feature';

const meta: Meta<typeof AppLayout> = {
  title: 'Layout/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

type Story = StoryObj<typeof AppLayout>;

export const Default: Story = {
  args: {
    title: 'Dashboard'
  },
  render: (args) => (
    <AppLayout {...args}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Welcome back to your workspace.</p>
        <Feature enabled={false}>
          <p className="text-sm">Upgrade your plan to unlock analytics.</p>
        </Feature>
      </div>
    </AppLayout>
  )
};


