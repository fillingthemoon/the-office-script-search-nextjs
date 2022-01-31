import { Flex, Spinner } from '@chakra-ui/react'

const PageLoadingSpinner = () => {
  return (
    <Flex
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      backgroundColor="rgba(0,0,0,0.6)"
    >
      <Flex
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%,-50%)"
      >
        <Spinner
          thickness="8px"
          speed="0.65s"
          emptyColor="gray.200"
          color="primary.500"
          size="xl"
        />
      </Flex>
    </Flex>
  )
}

export default PageLoadingSpinner
