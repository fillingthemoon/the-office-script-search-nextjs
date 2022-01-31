import Head from 'next/head'
import NextLink from 'next/link'
import { VStack, Heading, Link } from '@chakra-ui/react'
import Layout from '../components/layout'

const PageNotFound = (props) => {
  return (
    <div>
      <Head>
        <title>Page Not Found | The Office Script Search</title>
      </Head>
      <Layout>
        <VStack>
          <VStack
            textAlign="center"
            spacing={4}
            width="100vw"
            py={14}
          >
            <Heading fontSize="3.5rem" mb={8}>Page not found</Heading>
            <NextLink href="/" passHref>
              <Link color="primary.500" fontWeight={600}>
                Return home
              </Link>
            </NextLink>
          </VStack>
        </VStack>
      </Layout>
    </div>
  )
}

export default PageNotFound
