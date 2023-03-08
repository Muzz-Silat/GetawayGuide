package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.TravelGuide;

/**
 * Spring Data JPA repository for the TravelGuide entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TravelGuideRepository extends JpaRepository<TravelGuide, Long> {}
