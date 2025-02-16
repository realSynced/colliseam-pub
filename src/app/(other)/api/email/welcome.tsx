import { Body, Button, Column, Container, Head, Heading, Html, Img, Link, Preview, Row, Section, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface NexusWelcomeEmailProps {
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: string[];
}

// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "";

const PropDefaults: NexusWelcomeEmailProps = {
  steps: [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>Deck out your Profile.</strong> <Link>Build up your profile</Link> and make friends! These will be the people you talk to when you
          need help on a project or simply want to discuss about something.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>Join a community</strong> or <strong>create</strong> one! While there are many communities to join, you could be the start of a new
          one. <br />
          <Link>Learn how to create, join and manage communities.</Link>
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={3}>
          <strong>Get to Learning.</strong> With over 100 courses to choose from, embrace your inner nerd, and soar! The more courses you take, the
          higher up you'll be on the global leaderboard. . <Link>Show em' what you got!</Link>.
        </li>
      ),
    },
    // {
    //   id: 4,
    //   Description: (
    //     <li className="mb-20" key={4}>
    //       <strong>Set up a custom domain.</strong> You can register a new domain
    //       and buy it through Netlify or assign a domain you already own to your
    //       site. <Link>Add a custom domain</Link>.
    //     </li>
    //   ),
    // },
  ],
  links: ["Visit the Communities", "Contact us"],
};

interface WelcomeParams {
  username: string;
}

export const NexusWelcomeEmail = (
  { username }: WelcomeParams,
  { steps = PropDefaults.steps, links = PropDefaults.links }: NexusWelcomeEmailProps,
) => {
  return (
    <Html>
      <Head />
      <Preview>Nexus Welcome</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite text-base font-sans">
          {/* <Img
            src={`${baseUrl}/static/netlify-logo.png`}
            width="184"
            height="75"
            alt="Netlify"
            className="mx-auto my-20"
          /> */}

          <Container className="bg-white p-45">
            <Heading className="text-center my-0 leading-8">Welcome to Nexus.</Heading>
            <Text className="text-center text-gray-400 mb-20">
              <span className="text-black font-bold text-4xl block ">Nexus</span>
            </Text>
            <Section>
              <Row>
                <Text className="text-base">
                  Congratulations {username}! You're joining a welcoming community of developers around the world who use Nexus to learn, create, find
                  jobs and communicate!
                </Text>

                <Text className="text-base">Here's how to get started:</Text>
              </Row>
            </Section>

            <ul>{steps?.map(({ Description }) => Description)}</ul>

            <Section className="text-center">
              <Button className="bg-brand text-white rounded-lg py-3 px-[18px]">Go to your Profile</Button>
            </Section>

            <Section className="mt-45">
              <Row>
                {links?.map((link) => (
                  <Column key={link}>
                    <Link className="text-black underline font-bold">{link}</Link> <span className="text-green-500">→</span>
                  </Column>
                ))}
              </Row>
            </Section>
          </Container>

          <Container className="mt-20">
            <Section>
              <Row>
                <Column className="text-right px-20">
                  <Link>Visit Website</Link>
                </Column>
                <Column className="text-left">
                  <Link>Manage Preferences</Link>
                </Column>
              </Row>
            </Section>
            <Text className="text-center text-gray-400 mb-45">nexdevelopment.vercel.app</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NexusWelcomeEmail;
