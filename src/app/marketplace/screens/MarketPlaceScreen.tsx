import React, { useState, useEffect } from 'react';
import { Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';

import MarketPlaceHeader from '../components/MarketPlaceHeader';
import MarketPlaceSearch from '../components/MarketPlaceSearch';
import MarketPlaceFeatured from '../components/MarketPlaceFeatured/';
import { RESOURCES, GET_LOCKER } from '../../../service/queries';
import { ADD_RESOURCE_TO_LOCKER, DELETE_FROM_LOCKER } from '../../../service/mutations';

const MarketPlaceContainer = styled(Segment.Group)`
  margin: 0 !important;
  border: none;
`;

const MarketPlaceScreen = () => {
  const [searchField, setSearchField] = useState('');
  const [resources, setResources] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const email = useSelector((state: any) => state.auth.email);

  const { 
    loading: loadingLocker,
    data: lockerResponse,
    refetch: fetchLocker
  }= useQuery(GET_LOCKER, { variables: { email }});   
  const { data: resourcesResponse, loading: loadingResources } = useQuery(RESOURCES, {
    variables: { limit: 5 }
  })
  const [addToLocker] = useMutation(ADD_RESOURCE_TO_LOCKER);
  const [removeFromLocker] = useMutation(DELETE_FROM_LOCKER);

  const getResourcesOnLocker = (resources, resourcesFromLocker) => {
    return resources.map(resource => {
    const index = resourcesFromLocker.findIndex(lockerResource => lockerResource.resource_id === resource.id);
    if (index > -1) return { ...resource, onLocker: true };
    return resource;
  })}

  const handleLockerButtonPress = async (resourceId: string, onLocker: boolean)=> {
    try {
      if (onLocker){
        await removeFromLocker({ variables: {
          user_id: email,
          resource_id: resourceId
        }})
      } else {
        await addToLocker({ variables: {
          user_id: email,
          resource_id: resourceId
        }})
      }
      fetchLocker()
    } catch (err) {
      console.log("Error: ", err)
    }
  };

  const handleSearch = () => {    
    const filterResult = resourcesResponse.resources.filter(
      resource =>  (
        resource.name && resource.name.toLowerCase().search(searchField.toLowerCase()) !== -1 ||
        resource.description && resource.description.toLowerCase().search(searchField.toLowerCase()) !== -1
      )
    )
    setResources(
      getResourcesOnLocker(
        filterResult,
        lockerResponse.resources_locker
      )
    )
  };

  const handleFilterByCategory = categoryId => {
    setActiveCategory(categoryId)
    const filterResult = resourcesResponse.resources.filter(
      resource => resource.categories && resource.categories.includes(categoryId)
    )
    setResources(
      getResourcesOnLocker(
        filterResult,
        lockerResponse.resources_locker
      )
    )
  }

  const handleClearFilters = () => {
    if (resourcesResponse && lockerResponse) {
      setResources(
        getResourcesOnLocker(
          resourcesResponse.resources,
          lockerResponse.resources_locker
        )
      );
    }
    setSearchField('')
    setActiveCategory('')
  }

  useEffect(() => {
    if (resourcesResponse && lockerResponse) {
      setResources(
        getResourcesOnLocker(
          resourcesResponse.resources,
          lockerResponse.resources_locker
        )
      );
    }
  }, [resourcesResponse, lockerResponse])

  return (
  <MarketPlaceContainer>
    <MarketPlaceHeader />
    <MarketPlaceSearch
      searchField={searchField}
      setSearchField={setSearchField}
      handleSearch={handleSearch}
      handleFilterByCategory={handleFilterByCategory}
      handleClearFilters={handleClearFilters}
      activeCategory={activeCategory}
    />
    <MarketPlaceFeatured
      onLockerButtonPress={handleLockerButtonPress}
      resources={resources}
      loading={loadingResources || loadingLocker}
    />
  </MarketPlaceContainer>
)};

export default MarketPlaceScreen;