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
import NoteFormModal from "@/components/noteFormModal";

export default function Main({ notes }) {
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setisFormModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null); // Track the note to delete
  const [noteToEdit, setNoteToEdit] = useState(null); // Track the note to delete

  const router = useRouter();
  console.log("notes => ", notes);

  const handleFormModalOpen = ($note) => {
    setNoteToEdit($note)
    setisFormModalOpen(true);
  };

  const handleModalClose = () => {
    setisFormModalOpen(false);
    setisDeleteModalOpen(false);
    setNoteToDelete(null); // Reset noteToDelete state
    setNoteToEdit(null); // Reset noteToEdit state
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
    console.log("id => ", id);
    setNoteToDelete(id);
    setisDeleteModalOpen(true); // Open the confirmation modal
  };

  const handleSaveNote = async (note) => {
    if(noteToEdit) {
      try {
        const response = await fetch(`/api/notes/update/${noteToEdit.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: note.title,
            description: note.description
          })
        });
        const result = await response.json();
        console.log("result => ", result);
        if (result.success === true) {
          router.reload();
          setisFormModalOpen(false);
          setNoteToEdit(null);
        }

      } catch (error) {
        console.error("Error updating note:", error);
      }
    } else {
      try {
        console.log("note => ", note);
        const response = await fetch(`/api/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: note.title,
            description: note.description
          })
        });
        const result = await response.json();
        console.log("result => ", result);
        if (result.success === true) {
          router.reload();
          setisFormModalOpen(false);
        }
      } catch (error) {
        console.error("Error creating note:", error);
      }
    }
  };

  return (
    <>
      <LayoutComponent metaTitle="Home">
        <Box padding={5}>
          <Flex justifyContent="end">
            <Button colorScheme="blue" onClick={() => handleFormModalOpen(null)}>
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
                      <Button 
                      onClick={() => {handleFormModalOpen(note)}}
                      flex="1" 
                      variant="ghost">
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
        isOpen={isDeleteModalOpen}
        onClose={handleModalClose}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      <NoteFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          handleModalClose();
        }}
        onSave={handleSaveNote}
        noteToEdit={noteToEdit}
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
