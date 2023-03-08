package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TravelGuide.
 */
@Entity
@Table(name = "travel_guide")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TravelGuide implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "place", nullable = false)
    private String place;

    @NotNull
    @Column(name = "weather", nullable = false)
    private Instant weather;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TravelGuide id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlace() {
        return this.place;
    }

    public TravelGuide place(String place) {
        this.setPlace(place);
        return this;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public Instant getWeather() {
        return this.weather;
    }

    public TravelGuide weather(Instant weather) {
        this.setWeather(weather);
        return this;
    }

    public void setWeather(Instant weather) {
        this.weather = weather;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TravelGuide)) {
            return false;
        }
        return id != null && id.equals(((TravelGuide) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TravelGuide{" +
            "id=" + getId() +
            ", place='" + getPlace() + "'" +
            ", weather='" + getWeather() + "'" +
            "}";
    }
}
