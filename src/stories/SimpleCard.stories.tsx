import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {SimpleCard} from '../../src/components-v2/atoms/simple-card';

export default {
  title: 'UI Revamp v2.0/atoms/Simple Card',
  component: SimpleCard,
  argTypes: {
    activated: {
      options: [true, false],
    },
  },
} as ComponentMeta<typeof SimpleCard>;

const Template: ComponentStory<typeof SimpleCard> = args => <SimpleCard {...args} />;

const stonks =
  'https://gist.githack.com/ical10/8178e2e0d345c691ceffd0b9bdb065a0/raw/e6a2e66955752fa1203667ab80b8dab0b09c9aa6/stonks.svg';

export const Default = Template.bind({});
Default.args = {
  activated: true,
  imgUrl: stonks,
  isOwner: true,
};