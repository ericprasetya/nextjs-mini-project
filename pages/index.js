import { useState } from "react";
import {
  Flex,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Heading,
  Text,
  Button,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import LayoutComponent from "@/layout";
import DeleteConfirmationModal from "@/components/deleteConfirmationModal";

export default function Main({ notes }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null); // Track the note to delete

  const router = useRouter();
  console.log("notes => ", notes);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNoteToDelete(null); // Reset noteToDelete state
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/notes/delete/${noteToDelete}`, {
        method: "DELETE",
      });
      const result = await response.json();
      console.log("result => ", result);
      if (result.success === true) {
        router.reload();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      handleModalClose(); // Close the modal after delete operation
    }
  };

  const handleDeleteNote = (id) => {
    setNoteToDelete(id);
    setIsModalOpen(true); // Open the confirmation modal
  };

  return (
    <>
      <LayoutComponent metaTitle="Home">
        <Box padding={5}>
          <Flex justifyContent="end">
            <Button colorScheme="blue" onClick={handleModalOpen}>
              Add Note
            </Button>
          </Flex>
          <Flex>
            <Grid templateColumns="repeat(3, 1fr)" gap={5}>
              {notes?.data?.map((note) => (
                <GridItem key={note.id}>
                  <Card>
                    <CardHeader>
                      <Heading>{note.title}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text>{note.description}</Text>
                    </CardBody>
                    <CardFooter>
                      <Button flex="1" variant="ghost">
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteNote(note.id)}
                        flex="1"
                        colorScheme="red"
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          </Flex>
        </Box>
      </LayoutComponent>

      {/* Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onDelete={handleDelete}
      />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:3000/api/notes");
    const notes = await res.json();
    return { props: { notes } };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return { props: { notes: [] } }; // Handle error case
  }
}
