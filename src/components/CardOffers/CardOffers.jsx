import "./CardOffers.scss";

const formatAvailabilitySlot = (slot) => {
  if (!slot || !slot.start_date || !slot.end_date) return null;

  const startRaw = String(slot.start_date).replace(" ", "T");
  const endRaw = String(slot.end_date).replace(" ", "T");

  const startDate = new Date(startRaw);
  const endDate = new Date(endRaw);
  const hasValidDates =
    !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime());

  const startTime = slot.start_date.slice(11, 16);
  const endTime = slot.end_date.slice(11, 16);

  if (hasValidDates) {
    const dayLabel = new Intl.DateTimeFormat("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    }).format(startDate);

    if (startTime && endTime) {
      return `${dayLabel} ${startTime}-${endTime}`;
    }
    return dayLabel;
  }

  if (startTime && endTime) {
    const date = slot.start_date.slice(8, 10);
    const month = slot.start_date.slice(5, 7);
    return `${date}/${month} ${startTime}-${endTime}`;
  }

  return `${slot.start_date} - ${slot.end_date}`;
};

const getAvailabilityLabel = (offer) => {
  if (
    offer &&
    typeof offer.availabilityLabel === "string" &&
    offer.availabilityLabel.trim() !== ""
  ) {
    const trimmed = offer.availabilityLabel.trim();
    return trimmed.length > 40 ? `${trimmed.slice(0, 37)}...` : trimmed;
  }

  if (offer && Array.isArray(offer.availabilitySlots) && offer.availabilitySlots.length > 0) {
    const slotLabels = offer.availabilitySlots
      .map((slot) => formatAvailabilitySlot(slot))
      .filter(Boolean);
    if (slotLabels.length > 0) {
      const preview = slotLabels[0];
      return slotLabels.length > 2
        ? `${preview} (+${slotLabels.length - 1})`
        : preview;
    }
  }

  if (offer && Array.isArray(offer.disponibility) && offer.disponibility.length > 0) {
    const slotLabels = offer.disponibility
      .map((slot) => formatAvailabilitySlot(slot))
      .filter(Boolean);
    if (slotLabels.length > 0) {
      const preview = slotLabels[0];
      return slotLabels.length > 2
        ? `${preview} (+${slotLabels.length - 1})`
        : preview;
    }
  }

  if (offer && typeof offer.disponibility === "string") {
    return offer.disponibility;
  }

  return "";
};

const CardOffers = ({
  paginatedOffers,
  filteredOffersCount,
  loadingOffers,
  errorOffers,
  isCustomer,
  isFavorite,
  onAddFavorite,
  onRemoveFavorite,
  favLoading,
  getProviderLabel,
  selectedOffer,
  onSelectOffer,
  onCloseDetail,
  currentPage,
  totalPages,
  onPageChange,
  isSelectable = true,
}) => {
  const contentClassName = `service-catalog__content${
    selectedOffer ? " service-catalog__content--with-detail" : ""
  }`;

  return (
    <section className={contentClassName}>
      <div className="service-catalog__left">
        <div className="service-catalog__list">
          {errorOffers && (
            <div className="service-catalog__error">{errorOffers}</div>
          )}

          {loadingOffers && paginatedOffers.length === 0 && (
            <div className="service-catalog__loading">
              Chargement des services...
            </div>
          )}

          {!loadingOffers && filteredOffersCount === 0 && !errorOffers && (
            <div className="service-catalog__empty">
              Aucun service ne correspond a vos criteres pour le moment.
            </div>
          )}

          {paginatedOffers.map((offer) => {
            const availabilityText = getAvailabilityLabel(offer);
            const isCardClickable =
              isSelectable && typeof onSelectOffer === "function";
            const cardClass = isCardClickable
              ? "service-card"
              : "service-card service-card--static";
            return (
            <article
              key={offer.id_offer}
              className={cardClass}
              onClick={
                isCardClickable ? () => onSelectOffer(offer) : undefined
              }
            >
                <div className="service-card__top">
                  <div className="service-card__avatar">
                    <div className="service-card__avatar-circle">
                      {(offer.category || "S")[0].toUpperCase()}
                    </div>
                  </div>

                  <div className="service-card__header">
                    <div className="service-card__title-row">
                      <h2 className="service-card__title">
                        {offer.category || "Service"}
                      </h2>
                      <span className="service-card__price">
                        {offer.price ? `${offer.price} €` : "Sur devis"}
                      </span>
                    </div>

                    <div className="service-card__provider-line">
                      Propose par {getProviderLabel(offer)}
                    </div>

                    <div className="service-card__meta">
                      {offer.duration && (
                        <span className="service-card__meta-item">
                          Duree : {offer.duration}
                        </span>
                      )}
                      {availabilityText && (
                        <span className="service-card__meta-item">
                          {availabilityText}
                        </span>
                      )}
                      {offer.perimeter_of_displacement && (
                        <span className="service-card__meta-item">
                          Jusqu a {offer.perimeter_of_displacement}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="service-card__description">{offer.description}</p>

                <div className="service-card__tags">
                  {offer.category && (
                    <span className="service-card__tag">{offer.category}</span>
                  )}
                  {offer.perimeter_of_displacement && (
                    <span className="service-card__tag">
                      Rayon : {offer.perimeter_of_displacement}
                    </span>
                  )}
                </div>

                <div
                  className="service-card__bottom"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isCustomer ? (
                    <div className="service-card__actions">
                      {isFavorite(offer.id_offer) ? (
                        <button
                          type="button"
                          className="service-card__btn service-card__btn--ghost"
                          onClick={() => onRemoveFavorite(offer.id_offer)}
                          disabled={favLoading}
                        >
                          Retirer des favoris
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="service-card__btn"
                          onClick={() => onAddFavorite(offer.id_offer)}
                          disabled={favLoading}
                        >
                          Ajouter aux favoris
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="service-card__hint">
                      Connectez-vous en tant que client pour ajouter aux favoris.
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="service-catalog__pagination">
            <button
              type="button"
              className={`service-catalog__page-btn ${
                currentPage === 1 ? "service-catalog__page-btn--disabled" : ""
              }`}
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ƒ-?
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`service-catalog__page-btn ${
                  page === currentPage
                    ? "service-catalog__page-btn--active"
                    : ""
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className={`service-catalog__page-btn ${
                currentPage === totalPages
                  ? "service-catalog__page-btn--disabled"
                  : ""
              }`}
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
            >
              ƒ-ô
            </button>
          </div>
        )}
      </div>

      {selectedOffer && isSelectable && (
        <aside className="service-detail">
          <button
            type="button"
            className="service-detail__close"
            onClick={onCloseDetail}
          >
            X
          </button>

          <div className="service-detail__header">
            <div className="service-detail__avatar">
              {(selectedOffer.category || "S")[0].toUpperCase()}
            </div>
            <div className="service-detail__titles">
              <span className="service-detail__provider-name">
                {getProviderLabel(selectedOffer)}
              </span>
              <span className="service-detail__offer-title">
                {selectedOffer.category || "Service"}
              </span>
            </div>
          </div>

          <div className="service-detail__section">
            <h3>A propos du service</h3>
            <p>{selectedOffer.description}</p>
          </div>

          <div className="service-detail__section service-detail__grid">
            <div className="service-detail__info">
              <strong>Duree</strong>
              <span>{selectedOffer.duration || "Non precise"}</span>
            </div>
            <div className="service-detail__info">
              <strong>Disponibilite</strong>
              <span>
                {getAvailabilityLabel(selectedOffer) || "Non precise"}
              </span>
            </div>
            <div className="service-detail__info">
              <strong>Zone de deplacement</strong>
              <span>
                {selectedOffer.perimeter_of_displacement || "Non precise"}
              </span>
            </div>
            <div className="service-detail__info">
              <strong>Tarif</strong>
              <span>
                {selectedOffer.price ? `${selectedOffer.price} €` : "Sur devis"}
              </span>
            </div>
          </div>

          <button type="button" className="service-detail__cta">
            Demander ce service
          </button>
        </aside>
      )}
    </section>
  );
};

export default CardOffers;
