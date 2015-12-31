class PetrolFinderController < ApplicationController
  respond_to :json, :html
  def index

    respond_to do |format|
      format.html {}
      format.json {}
    end
  end
end
