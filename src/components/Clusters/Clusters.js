import React, { useState, useEffect } from "react";
import { Accordion } from "react-accessible-accordion";
import ClusterAccordionItem from "./ClusterAccordionItem/ClusterAccordionItem";
import Graph from "react-graph-vis";
import {
  createClusterCommand,
  runCypherQuery,
  createPersonWithExistingCluster,
  createPersonRelatedToAnotherPerson,
  createPersonAlongWithNewCluster,
  editAPerson,
  deleteAPerson,
  getClusterData,
  getAllClustersData
} from "./../../db";
import ClusterHead from "./ClusterHead/ClusterHead";
import CreateSuspectForm from "../CreateSuspectForm/CreateSuspectForm";

import { mapResultToGraph } from "./../../mappers";

const Clusters = props => {
  const [clusters, setClusters] = useState([]);
  const [isSuspectFormOpen, setIsSuspectFormOpen] = useState(false);
  const toggleSuspectForm = () => setIsSuspectFormOpen(!isSuspectFormOpen);
  // const onCreateCluster = async () =>
  //   runCypherQuery(createClusterCommand("Delhi"));

  // const onCreatePersonWithExistingCluster = () =>
  //   createPersonWithExistingCluster("Delhi", {
  //     name: "P1",
  //     age: 20,
  //     status: "Positive",
  //     location: "Hospitalized",
  //     notes: "Returned from italy"
  //   });

  // const onCreatePersonRelatedToAnotherPerson = () =>
  //   createPersonRelatedToAnotherPerson(
  //     { name: "P1" },
  //     {
  //       name: "P2",
  //       age: 20,
  //       status: "Positive",
  //       location: "Hospitalized",
  //       notes: "Returned from italy"
  //     }
  //   );

  // const onCreatePersonAlongWithNewCluster = () =>
  //   createPersonAlongWithNewCluster(
  //     {
  //       name: "P3",
  //       age: 24,
  //       status: "Positive",
  //       location: "Hospitalized",
  //       notes: "Returned from USA"
  //     },
  //     { name: "Andhra Pradesh" }
  //   );

  // const onEditAPerson = () =>
  //   editAPerson({
  //     name: "P1",
  //     age: 15,
  //     notes: "Young suspect"
  //   });

  // const onDeleteAPerson = () =>
  //   deleteAPerson({
  //     name: "P2"
  //   });

  useEffect(() => {
    const getData = async () => {
      let clusters = [];
      const allClustersData = await getAllClustersData();
      const { records } = allClustersData;

      records.forEach(
        ({ _fields }) => _fields && _fields.length && clusters.push(_fields[0])
      );

      clusters = clusters.map(async cluster => {
        const clusterData = await getClusterData(cluster);
        return {
          name: cluster,
          ...mapResultToGraph(clusterData)
        };
      });

      return Promise.all(clusters);
    };

    getData()
      .then(clusters => {
        setClusters(clusters);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <ClusterHead toggleSuspectForm={toggleSuspectForm} />
      <Accordion allowZeroExpanded={true}>
        {clusters.length
          ? clusters.map(cluster => (
              <ClusterAccordionItem
                key={cluster.name}
                cluster={cluster}
                toggleSuspectForm={toggleSuspectForm}
              />
            ))
          : null}
      </Accordion>
      {isSuspectFormOpen ? (
        <CreateSuspectForm onClose={toggleSuspectForm} />
      ) : null}
    </>
  );
};

export default Clusters;
